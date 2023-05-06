const express = require('express');
const connectDB = require('./config/db');

const app = express()

// connect database
connectDB();

//init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// define routes
app.use('/course', require('./router/course'));
app.use('/auth', require('./router/auth'));
app.use('/professor', require('./router/professor'));
app.use('/student', require('./router/student'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port 5000'));