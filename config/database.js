const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS ? "Loaded" : "Missing");
console.log("DB_NAME:", process.env.DB_NAME);

module.exports = db;
