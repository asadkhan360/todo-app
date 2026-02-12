const mysql = require('mysql2');

// Connection pool create kar rahe hain
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // maximum 10 simultaneous connections
  queueLimit: 0
});

// Promise wrapper for async/await queries
const db = pool.promise();

db.getConnection()
  .then(conn => {
    console.log(`Connected to MySQL database: ${process.env.DB_NAME}`);
    conn.release(); // connection release kar do, pool handle karega
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err.message);
  });

module.exports = db;
