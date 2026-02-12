const db = require('../config/database'); // remote DB connection
const todoModel = require('../models/todo');

export default function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        todoModel.getAllTodos((err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ data: results, total: results.length });
        });
    }
    else if (method === 'POST') {
        const { title } = req.body;
        if (!title) return res.status(400).json({ message: 'Title required' });

        const wordCount = title.split(/\s+/).filter(w => w).length;
        if (wordCount > 50) return res.status(400).json({ message: 'Todo 50 words se zyada nahi ho sakta' });

        todoModel.createTodo({ title }, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: 'Todo created', id: result.insertId });
        });
    }
    else if (method === 'PUT') {
        const id = req.query.id;
        const { title } = req.body;
        if (!id || !title) return res.status(400).json({ message: 'ID & Title required' });

        todoModel.updateTodo(id, { title, updated_at: new Date() }, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ message: 'Todo updated' });
        });
    }
    else if (method === 'DELETE') {
        const id = req.query.id;
        if (!id) return res.status(400).json({ message: 'ID required' });

        todoModel.deleteTodo(id, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ message: 'Todo deleted' });
        });
    }
    else {
        res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
