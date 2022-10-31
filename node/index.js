const util = require('util');
const con = require('./db.js');

const query = util.promisify(con.query).bind(con);

require('dotenv').config();

function handleDisconnect() {
    con.connect(async function (err) {
        if (err) throw err;
        const check_tables = await query(`SELECT * FROM information_schema.tables WHERE table_schema = '${process.env.DB}' AND table_name = 'students' LIMIT 1;`)
        if (check_tables.length === 0) {
            await query("CREATE TABLE students (student_id INT NOT NULL AUTO_INCREMENT, absences INT NOT NULL, fullname VARCHAR(256) NOT NULL, grade VARCHAR(128), student_lectures VARCHAR(16384) NOT NULL, student_hex VARCHAR(128) NOT NULL, PRIMARY KEY ( student_id ));");
            await query("CREATE TABLE lectures (lecture_id INT NOT NULL AUTO_INCREMENT, lecture_title VARCHAR(512) NOT NULL, lecture_teacher VARCHAR(256), lecture_students VARCHAR(16384) NOT NULL, lecture_date DATE, has_concluded BOOLEAN NOT NULL, PRIMARY KEY ( lecture_id ));");
            await query("CREATE TABLE teachers (teacher_id INT NOT NULL AUTO_INCREMENT, teacher_name VARCHAR(512), teacher_hex VARCHAR(128) NOT NULL, PRIMARY KEY ( teacher_id ));");
        }
    });     

    con.on('error', function(err) {
        console.log('db error', err);
        handleDisconnect(); 
    });
  }
  
handleDisconnect();

module.exports = query;
