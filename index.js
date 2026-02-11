require('dotenv').config();  // ye top me ho

// express ko import kar rahe hain, ye framework hai jo HTTP requests handle karta hai
const express = require('express');

// body-parser import kar rahe hain, ye middleware hai jo JSON request ka data parse karta hai
const bodyParser = require('body-parser');

// path import kar rahe hain, static frontend serve karne ke liye
const path = require('path');

// dotenv ko load kar rahe hain, taake .env file ke variables process.env me aa jaye
require('dotenv').config();

// express app initialize kar rahe hain
const app = express();

// PORT set kar rahe hain: agar .env me PORT nahi hai to default 3000 use hoga
const PORT = process.env.PORT || 3000;

// body-parser ko use kar rahe hain, iska matlab hai ke jo bhi JSON client bheje, req.body me aajayega
app.use(bodyParser.json());

/* -------------------------
   FRONTEND (STATIC FILES)
   public folder serve hoga
   http://localhost:3000
--------------------------*/
app.use(express.static(path.join(__dirname, 'public')));

// apne todos ke routes import kar rahe hain
const todoRoutes = require('./routes/todoRoutes');

// todos ke routes ko use kar rahe hain, /todos se start honge
// example: GET /todos, POST /todos
app.use('/todos', todoRoutes);

// error middleware import kar rahe hain (routes ke baad)
const errorMiddleware = require('./middleware/errorMiddleware');

// global error middleware use kar rahe hain, ye saare errors catch karega
app.use(errorMiddleware);

// server start kar rahe hain aur PORT pe listen kar rahe hain
// jab server start ho jaye to message console me print hoga
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
