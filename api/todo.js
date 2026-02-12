import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config(); // .env ke variables load honge

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Serverless handler
export default async function handler(req, res) {
    const connection = await mysql.createConnection(connectionConfig);

    try {
        if (req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM todos ORDER BY id DESC');
            res.status(200).json(rows);
        } 
        else if (req.method === 'POST') {
            const { title } = req.body;
            if (!title || title.split(/\s+/).filter(w => w).length > 50) {
                return res.status(400).json({ message: "Invalid todo" });
            }
            const [result] = await connection.execute('INSERT INTO todos (title) VALUES (?)', [title]);
            res.status(201).json({ id: result.insertId, title });
        } 
        else if (req.method === 'PUT') {
            const { id, title } = req.body;
            await connection.execute('UPDATE todos SET title=? WHERE id=?', [title, id]);
            res.status(200).json({ id, title });
        } 
        else if (req.method === 'DELETE') {
            const { id } = req.body;
            await connection.execute('DELETE FROM todos WHERE id=?', [id]);
            res.status(200).json({ message: 'Todo deleted' });
        } 
        else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await connection.end();
    }
}
