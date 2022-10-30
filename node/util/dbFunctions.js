const query = require('../index.js');
const con = require('../db.js');

const createNewStudent = (student) => {
    const sql = `INSERT INTO students (absences, fullname, grade, student_lectures) VALUES ('${student.absences}', '${student.fullname}', '${student.grade}', '(${student.student_lec})')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Student Successfully Created");
    });
}

const updateAbsences = async(id, quantity) => {
    try {
        let sql = `SELECT DISTINCT * from students WHERE student_id = ${id}`;
        const res_student = await query(sql);

        let stud;
        Object.keys(res_student).forEach(function(key) {
            stud = res_student[key];
        })

        const res_obj = {
            student_id: stud.student_id,
            absences: stud.absences
        };

        sql = `UPDATE students SET ABSENCES = '${res_obj.absences + quantity}' WHERE student_id = ${res_obj.student_id} `;
        await query(sql);
    } catch (err) {
        console.log(`An error occured whilst trying to update student absences: ${err}`)
    }
}

const createLecture = async(lecture) => {
    try {
        let sql = `INSERT INTO lectures (lecture_title, lecture_teacher, lecture_students, lecture_date) VALUES ('${lecture.lecture_title}', '${lecture.lecture_teacher}', '(${lecture.lecture_students})', '${lecture.lecture_date}')`
        await query(sql);
        for (let i = 0; i < lecture.lecture_students.length; i++) {
            checkLecture(lecture, lecture.lecture_students[i]);
        }
    } catch (err) {
        console.log(err);
    }
}

const checkLecture = async(lecture, id) => {
    let sql = `SELECT DISTINCT * from students WHERE student_id = ${id}`;
    let res = await query(sql);
    if (res.length === 0) return;
    let stud_res;
    Object.keys(res).forEach(function(key) {
        stud_res = res[key];
    })
    stud_res.student_lectures = stud_res.student_lectures.replaceAll("(", "");
    stud_res.student_lectures = stud_res.student_lectures.replaceAll(")", "");
    stud_res.student_lectures = stud_res.student_lectures.split(",")
    
    sql = `SELECT * from students WHERE '${lecture.lecture_title}' IN (${stud_res.student_lectures.map((val) => `'${val}'`)}) AND 'students.student_id' NOT IN (${lecture.lecture_students.map((val) =>
        `'${val}'`
    )})`

    const req = await query(sql);
    if (req.length > 0) updateAbsences(req[0].student_id, 1);
}

const findStudent = async(id) => {
    let sql = `SELECT DISTINCT * from students WHERE `
}


module.exports = { createNewStudent, updateAbsences, createLecture, checkLecture };