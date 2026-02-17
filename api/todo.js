const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    let connection;

    try {
        // ✅ Connection pehle banao
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // =========================
        // GET - Search + Date Filter
        // =========================
        if (req.method === 'GET') {

            const { search, date } = req.query;

            let sql = 'SELECT * FROM todos WHERE 1=1';
            const params = [];

            if (search && search.trim() !== '') {
                sql += ' AND title LIKE ?';
                params.push(`%${search}%`);
            }

            if (date && date.trim() !== '') {
                sql += ' AND DATE(created_at) = ?';
                params.push(date);
            }

            sql += ' ORDER BY id DESC';

            const [rows] = await connection.execute(sql, params);

            await connection.end();
            return res.status(200).json({ data: rows });
        }

        // =========================
        // POST
        // =========================
        if (req.method === 'POST') {
            const { title } = req.body;

            if (!title) {
                return res.status(400).json({ message: 'Title required' });
            }

            await connection.execute(
                'INSERT INTO todos (title, created_at, updated_at) VALUES (?, NOW(), NOW())',
                [title]
            );

            await connection.end();
            return res.status(201).json({ message: 'Todo created' });
        }

        // =========================
        // PUT
        // =========================
        if (req.method === 'PUT') {
            const { id, title } = req.body;

            if (!id || !title) {
                return res.status(400).json({ message: 'ID and Title required' });
            }

            await connection.execute(
                'UPDATE todos SET title = ?, updated_at = NOW() WHERE id = ?',
                [title, id]
            );

            await connection.end();
            return res.status(200).json({ message: 'Todo updated' });
        }

        // =========================
        // DELETE
        // =========================
        if (req.method === 'DELETE') {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID required' });
            }

            await connection.execute(
                'DELETE FROM todos WHERE id = ?',
                [id]
            );

            await connection.end();
            return res.status(200).json({ message: 'Todo deleted' });
        }

        await connection.end();
        return res.status(405).json({ message: 'Method Not Allowed' });

    } catch (err) {
        console.log(err);
        if (connection) await connection.end();
        return res.status(500).json({ error: err.message });
    }
};
