const mysql = require('mysql');

require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const pwd = process.env.PWD;
const db = process.env.DB;

const con = mysql.createConnection({
    host: host,
    user: user,
    password: pwd,
    database: db
});

module.exports = con;