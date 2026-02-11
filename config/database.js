// mysql2 package import kar rahe hain, ye MySQL database ke saath interact karne ke liye hota hai
const mysql = require('mysql2');

// MySQL database ka connection create kar rahe hain
const connection = mysql.createConnection({
    host: 'localhost',          // Ye MySQL server ka address hai, local machine ke liye localhost
    user: 'root',               // Ye MySQL ka username, aksar root hota hai
    password: '',               // Ye MySQL ka password, aapko apna set karna hoga
    database: 'node_curd'       // Ye database ka naam jisse hum connect karna chahte hain
});

// Connect kar rahe hain MySQL database se
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message); // Agar connection fail ho jaye to error print hoga
        return; // Agar error ho to function yahi ruk jaata hai
    }
    console.log('Connected to MySQL database: node_curd'); // Agar success ho to ye message console me aayega
});

// Ye connection export kar     rahe hain taake dusre files (jaise controllers) me use ho sake
module.exports = connection;
