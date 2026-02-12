const db = require('../config/database');

exports.getAllTodos = (callback) => {
    db.query('SELECT * FROM todos ORDER BY id DESC', callback);
};

exports.getTodoById = (id, callback) => {
    db.query('SELECT * FROM todos WHERE id = ?', [id], callback);
};

exports.createTodo = (newTodo, callback) => {
    db.query('INSERT INTO todos SET ?', newTodo, callback);
};

exports.updateTodo = (id, updatedTodo, callback) => {
    db.query('UPDATE todos SET ? WHERE id = ?', [updatedTodo, id], callback);
};

exports.deleteTodo = (id, callback) => {
    db.query('DELETE FROM todos WHERE id = ?', [id], callback);
};
