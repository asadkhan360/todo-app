const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD, // ✅ FIXED
            database: process.env.DB_NAME
        });

        if (req.method === 'GET') {
            const [rows] = await connection.execute(
                'SELECT * FROM todos ORDER BY id DESC'
            );
            await connection.end();
            return res.status(200).json({ data: rows });
        }

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

        await connection.end();
        return res.status(405).json({ message: 'Method Not Allowed' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};
