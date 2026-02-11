// MySQL database connection import
const db = require('../config/database');

/* -------------------------
   GET ALL TODOS (WITH SEARCH, DATE FILTER & PAGINATION)
--------------------------*/
exports.getAllTodos = (req, res, next) => {
    // Query parameters se search, date aur page number le rahe hain
    const { search, date, page = 1 } = req.query;

    const limit = 10; // ek page me 10 records dikhaye
    const offset = (page - 1) * limit; // page number ke hisaab se offset

    let where = "WHERE 1=1"; // base condition, jisse hum aage filters add kar sake
    let params = []; // SQL query ke parameters

    // Agar search query hai to title me search karenge
    if (search) {
        where += " AND title LIKE ?";
        params.push(`%${search}%`); // % for partial match
    }

    // Agar date filter hai to us date ke records fetch karenge
    if (date) {
        where += " AND DATE(created_at) = ?";
        params.push(date);
    }

    // Data fetch karne ki SQL query
    const dataSql = `
        SELECT * FROM todos
        ${where}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    `;

    // Total records count karne ke liye SQL query (pagination ke liye)
    const countSql = `
        SELECT COUNT(*) as total FROM todos ${where}
    `;

    // Pehle total count query run karenge
    db.query(countSql, params, (err, countResult) => {
        if (err) return next(err);

        const total = countResult[0].total; // total records

        // Actual todos fetch karenge
        db.query(
            dataSql,
            [...params, limit, offset],
            (err, results) => {
                if (err) return next(err);
                // Response me data aur total count bhejenge
                res.json({ data: results, total });
            }
        );
    });
};

/* -------------------------
   GET TODO BY ID
--------------------------*/
exports.getTodoById = (req, res, next) => {
    const id = req.params.id; // URL parameter se id le rahe hain

    // Specific todo fetch karne ki query
    db.query("SELECT * FROM todos WHERE id = ?", [id], (err, results) => {
        if (err) return next(err);

        // Agar record nahi mila to 404 return
        if (results.length === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Record mil gaya, send as JSON
        res.json(results[0]);
    });
};

/* -------------------------
   CREATE TODO
--------------------------*/
exports.createTodo = (req, res) => {
    const { title } = req.body;

    // 🔒 WORD LIMIT CHECK (BACKEND)
    const wordCount = title.split(/\s+/).filter(w => w).length;
    if (wordCount > 50) {
        return res.status(400).json({
            message: 'Todo 50 words se zyada nahi ho sakta'
        });
    }

    const sql = `
        INSERT INTO todos (title)
        VALUES (?)
    `;

    db.query(sql, [title], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'Todo created', id: result.insertId });
    });
};

/* -------------------------
   UPDATE TODO
--------------------------*/
exports.updateTodo = (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    // 🔒 WORD LIMIT CHECK (BACKEND)
    const wordCount = title.split(/\s+/).filter(w => w).length;
    if (wordCount > 50) {
        return res.status(400).json({
            message: 'Todo 50 words se zyada nahi ho sakta'
        });
    }

    const updateSql = `
        UPDATE todos
        SET title = ?, updated_at = NOW()
        WHERE id = ?
    `;

    db.query(updateSql, [title, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        const selectSql = `
            SELECT id, title, created_at, updated_at
            FROM todos
            WHERE id = ?
        `;

        db.query(selectSql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(result[0]);
        });
    });
};



/* -------------------------
   DELETE TODO
--------------------------*/
exports.deleteTodo = (req, res, next) => {
    const id = req.params.id; // URL parameter se id

    // Delete query
    db.query(
        "DELETE FROM todos WHERE id = ?",
        [id],
        (err) => {
            if (err) return next(err);
            // Successfully deleted
            res.json({ message: "Todo deleted" });
        }
    );
};

/* -------------------------
   SIMPLE GET ALL TODOS (WITHOUT PAGINATION)
   Optional search & date filter
--------------------------*/
exports.getAllTodos = (req, res, next) => {
    const { search, date } = req.query;

    let sql = "SELECT * FROM todos WHERE 1=1"; // base query
    let params = [];

    // 🔍 Search by title
    if (search) {
        sql += " AND title LIKE ?";
        params.push(`%${search}%`);
    }

    // 📅 Filter by created date
    if (date) {
        sql += " AND DATE(created_at) = ?";
        params.push(date);
    }

    sql += " ORDER BY id DESC"; // latest first

    // Execute query
    db.query(sql, params, (err, results) => {
        if (err) return next(err);
        res.json(results); // send results
    });
};
