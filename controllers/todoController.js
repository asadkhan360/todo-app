const db = require('../config/database'); // pool based connection

/* -------------------------
   GET ALL TODOS (SEARCH + DATE FILTER + PAGINATION)
--------------------------*/
exports.getAllTodos = async (req, res) => {
    try {
        const { search, date, page, limit } = req.query;

        const pageNum = parseInt(page) || 1;
        const pageLimit = parseInt(limit) || 10;
        const offset = (pageNum - 1) * pageLimit;

        let where = "WHERE 1=1";
        const params = [];

        if (search) {
            where += " AND title LIKE ?";
            params.push(`%${search}%`);
        }
        if (date) {
            where += " AND DATE(created_at) = ?";
            params.push(date);
        }

        const [totalResult] = await db.query(`SELECT COUNT(*) as total FROM todos ${where}`, params);
        const total = totalResult[0].total;

        const [rows] = await db.query(
            `SELECT * FROM todos ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [...params, pageLimit, offset]
        );

        res.json({ data: rows, total, page: pageNum, limit: pageLimit });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
};

/* -------------------------
   GET TODO BY ID
--------------------------*/
exports.getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Todo not found" });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
};

/* -------------------------
   CREATE TODO
--------------------------*/
const Todo = require('../models/todo');

exports.createTodo = (req, res) => {
    const { title } = req.body;
    const wordCount = title.split(/\s+/).filter(w => w).length;
    if (wordCount > 50) return res.status(400).json({ message: "Todo 50 words se zyada nahi ho sakta" });

    Todo.createTodo({ title }, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Todo created", id: result.insertId });
    });
};

/* -------------------------
   UPDATE TODO
--------------------------*/
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const wordCount = title.split(/\s+/).filter(w => w).length;
        if (wordCount > 50) return res.status(400).json({ message: "Todo 50 words se zyada nahi ho sakta" });

        const [result] = await db.query(
            "UPDATE todos SET title = ?, updated_at = NOW() WHERE id = ?",
            [title, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: "Todo not found" });

        const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
};

/* -------------------------
   DELETE TODO
--------------------------*/
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM todos WHERE id = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
};
