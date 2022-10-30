const util = require('util');
const con = require('./db.js');

const query = util.promisify(con.query).bind(con);

require('dotenv').config();

con.connect(async function (err) {
    if (err) throw err;
    const check_tables = await query(`SELECT * FROM information_schema.tables WHERE table_schema = '${process.env.DB}'  AND table_name = 'students' LIMIT 1;`)
    if (check_tables.length === 0) {
        await query("CREATE TABLE students (student_id INT NOT NULL AUTO_INCREMENT, absences INT NOT NULL, fullname VARCHAR(256) NOT NULL, grade VARCHAR(128), student_lectures VARCHAR(16384), PRIMARY KEY ( student_id ));");
        await query("CREATE TABLE lectures (lecture_id INT NOT NULL AUTO_INCREMENT, lecture_title VARCHAR(512) NOT NULL, lecture_teacher VARCHAR(256), lecture_students VARCHAR(16384), lecture_date DATE, PRIMARY KEY ( lecture_id ));");
    }
});

const demo_stud = {
    absences: 0,
    fullname: "Μήτσος Χαρής",
    grade: "Α Λυκείου",
    student_lec: ['Μαθηματικά', 'Αγγλικά'],
    student_id: 1
}

let date = new Date();
date = date.getUTCFullYear() + '-' +
('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
('00' + date.getUTCDate()).slice(-2) + ' ' + 
('00' + date.getUTCHours()).slice(-2) + ':' + 
('00' + date.getUTCMinutes()).slice(-2) + ':' + 
('00' + date.getUTCSeconds()).slice(-2);

const demo_lecture = {
    lecture_id: 1,
    lecture_title: 'Μαθηματικά',
    lecture_teacher: 'Βασίλης Καρατσιανός',
    lecture_students: [0, 1, 6],
    lecture_date: date
}

module.exports = query;
