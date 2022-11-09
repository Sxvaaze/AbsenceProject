const query = require('../index.js');
const con = require('../db.js');

const createNewStudent = (student) => {
    try {
        const sql = `INSERT INTO students (absences, fullname, grade, student_lectures, student_hex) VALUES ('${student.absences}', '${student.fullname}', '${student.grade}', '(${student.student_lectures})', '${student.student_hex}')`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Student Successfully Created");
        });
    } catch(err) {
        return `An error occured whilst trying to create new student. ${err}`;
    }
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

const createLecture = async(lecture, mode) => {
    try {
        let sql;
        if (mode == "open") {
            sql = `INSERT INTO lectures (lecture_title, lecture_teacher, lecture_students, lecture_date, has_concluded) VALUES ('${lecture.lecture_title}', '${lecture.lecture_teacher}', '(${lecture.lecture_students})', '${lecture.lecture_date}', FALSE)`
            await query(sql);
        }
        else if (mode == "close") {
            sql = 'SELECT * FROM lectures ORDER BY lecture_id DESC LIMIT 1';
            const r = await query(sql);
            
            r[0].lecture_students = r[0].lecture_students.replaceAll("(", "");
            r[0].lecture_students = r[0].lecture_students.replaceAll(")", "");
            r[0].lecture_students = r[0].lecture_students.split(",");
            for (let i = 0; i < r[0].lecture_students.length; i++) {
                checkLecture(r[0]);
            }
            sql = `UPDATE lectures SET has_concluded = 1 WHERE lecture_id = ${r[0].lecture_id}`;
            await query(sql);
        }
    } catch (err) {
        console.log(err);
    }
}

const checkLecture = async(lecture) => {
    try {
        sql = `SELECT * from students WHERE '${lecture.lecture_title}' IN (students.student_lectures) AND students.student_id NOT IN (${lecture.lecture_students.map((val, index) =>
            `'${val}'`
        )})`

        const req = await query(sql);
        if (req.length > 0) updateAbsences(req[0].student_id, 1);
    } catch (err) {
        console.log(`An error occured whilst trying to check lecture, ${err}`)
    }
}

const findStudentById = async(id) => {
    try {
        const sql = `SELECT DISTINCT * from students WHERE student_id = ${id}`;
        const res = await query(sql);
        if (res.length !== 0) { return res; }
        throw new Error(`Couldn't find student with id: ${id}`);
    } catch (err) {
        console.log(`An error occured whilst trying to find student by id. ${err}`)
    }
}

const findLectureById = async(id) => {
    try {
        const sql = `SELECT DISTINCT * from lectures WHERE lecture_id = ${id}`;
        const res = await query(sql);
        if (res.length !== 0) { return res; }
        throw new Error(`Couldn't find lecture with id ${id}.`);
    } catch (err) {
        console.log(`An error occured whilst trying to find lecture by id. ${err}`);
    }
}

const truncateStudents = async() => {
    try {
        const sql = `TRUNCATE table students;`;
        await query(sql);
    } catch (err) {
        console.log(`Couldn't truncate table students. ${err}`);
    }
}

const truncateLectures = async() => {
    try {
        const sql = `TRUNCATE table lectures;`;
        await query(sql);
    } catch(err) {
        console.log(`Couldn't truncate table lectures. ${err}`);
    }
}

const createTeacher = async(teacher) => {
    try {
        const sql = `INSERT INTO teachers (teacher_name, teacher_hex) VALUES ('${teacher.teacher_name}', '${teacher.teacher_hex}')`
        await query(sql);
    } catch(err) {
        console.log(`An error occured whilst trying to create teacher. ${err}`);
    }
}

const appendStudentToActiveLecture = async(student_id) => {
    try {
        let sql = `SELECT DISTINCT * FROM lectures ORDER BY lecture_id DESC LIMIT 1`;
        let res = await query(sql);
        if (res.length === 0) throw new Error(["Error, no lectures found.", false]);
        const arr = res[0]['lecture_students'].split(")");
        const str = arr[0];
        console.log(str);
        const arr_check = res[0]['lecture_students'].replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "").split(",");
        let int_arr_check = [];
        arr_check.map((key) => int_arr_check.push(parseInt(key)));
        for (let i = 0; i < int_arr_check.length; i++) {
            if (student_id === int_arr_check[i]) throw new Error("Student has already entered the lecture. ");
        }
        sql = `UPDATE lectures SET lecture_students = '${str + (str === '(' ? "" : ",") + student_id + ")" }' WHERE lecture_id = ${res[0]['lecture_id']}`
        console.log(sql);
        res = await query(sql);
        if (res.length === 0) throw new Error(["Unexpected error occured while trying to append student. ", false]);
        return ["Sucessfully appended student to lecture. ", true];
    } catch(err) {
        console.log(`An error occured while trying to append student to active lecture. ${err}`);
    }
}

module.exports = { createNewStudent, updateAbsences, createLecture, checkLecture,
    findStudentById, findLectureById, truncateStudents, truncateLectures,
    createTeacher, appendStudentToActiveLecture};