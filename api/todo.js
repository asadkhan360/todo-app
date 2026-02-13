const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        if (req.method === 'GET') {
            const [rows] = await connection.execute(
                'SELECT * FROM todos ORDER BY id DESC'
            );

            await connection.end();
            return res.status(200).json({ data: rows });
        }

        res.status(405).json({ message: 'Method Not Allowed' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
