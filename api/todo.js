// api/todo.js
import db from '../config/database.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { title } = req.body;
        if (!title) return res.status(400).json({ message: 'Todo empty' });

        try {
            const [result] = await db.query('INSERT INTO todos (title) VALUES (?)', [title]);
            res.status(201).json({ message: 'Todo created', id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Database error' });
        }
    } else if (req.method === 'GET') {
        try {
            const [rows] = await db.query('SELECT * FROM todos ORDER BY id DESC');
            res.status(200).json({ data: rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Database error' });
        }
    } else {
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
