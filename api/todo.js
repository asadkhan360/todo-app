const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

module.exports = (req, res) => {
    if (req.method === 'GET') {
        db.query('SELECT * FROM todos ORDER BY id DESC', (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err });
            }
            res.status(200).json({ data: results });
        });
    }
};
