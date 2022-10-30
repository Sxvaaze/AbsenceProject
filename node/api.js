const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const students_route = require('./api-routes/students.js')

const port = 4096;

app.listen(port, () => {
    console.log('API Initialized.');
})

app.use('/api/students', students_route);

module.exports = app;