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

const createLecture = async(lecture) => {
    try {
        let sql = `INSERT INTO lectures (lecture_title, lecture_teacher, lecture_students, lecture_date, has_concluded) VALUES ('${lecture.lecture_title}', '${lecture.lecture_teacher}', '(${lecture.lecture_students})', '${lecture.lecture_date}', FALSE)`
        await query(sql);
        lecture.lecture_students = lecture.lecture_students.split(",");
        for (let i = 0; i < lecture.lecture_students.length; i++) {
            checkLecture(lecture, lecture.lecture_students[i]);
        }
    } catch (err) {
        console.log(err);
    }
}

const checkLecture = async(lecture, id) => {
    try {
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
        sql = `SELECT * from students WHERE '${lecture.lecture_title}' IN (${stud_res.student_lectures.map((item, index) => `'${item}'`)}) AND students.student_id NOT IN (${lecture.lecture_students.map((val, index) =>
            `'${val}'`
        )})`

        const req = await query(sql);
        console.log(req, req.length)
        if (req.length > 0) updateAbsences(req[0].student_id, 1);
    } catch (err) {
        console.log(`An erro occured whilst trying to check lecture, ${err}`)
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

const findStudentByHex = async(hex) => {
    try {
        const sql = `SELECT DISTINCT * from students WHERE student_hex = ${hex}`;
        const res = await query(sql);
        if (res.length !== 0) { return res; }
        throw new Error(`Couldn't find student with hex: ${hex}`);
    } catch(err) {
        console.log(`An error occured whilst trying to find student by hex. ${err}`);
    }
}

const findTeacherByHex = async(teacher_hex) => {
    try {
        const sql = `SELECT DISTINCT * from teachers WHERE teacher_hex = ${teacher_hex}`;
        const res = await query(sql);
        if (res.length !== 0) { return res; }
        throw new Error(`Couldn't find teacher with hex: ${hex}`);
    } catch(err) {
        console.log(`An error occured whilst trying to find teacher by hex. ${err}`);
    }
}

const initLectureByHex = async() => {
    try {
        let sql = `SELECT has_concluded FROM lectures ORDER BY lecture_id DESC LIMIT 1`;
        const res = await query(sql);
        if (res.length !== 0) return [res[0]['has_concluded'], true];
        return ["No lectures have been found, maybe the lectures table is empty? ", false];
    } catch(err) {
        console.log(`An error occured whilst trying to init lecture by hex activation. Error ${err}`);
    }
}

const updateLectureConcluded = async() => {
    try {
        let last_id = await query(`SELECT lecture_id FROM lectures ORDER BY lecture_id DESC LIMIT 1`);
        let sql = `UPDATE lectures SET has_concluded = TRUE WHERE lecture_id = ${last_id[0]['lecture_id']}`;
        const res = await query(sql);
    } catch(err) {
        console.log(`An error occured whilst trying to update lecture concluded state. ${err}`);
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

const appendStudentToActiveLecture = async(student) => {
    try {
        let sql = `SELECT DISTINCT * FROM lectures ORDER BY lecture_id DESC LIMIT 1`;
        let res = await query(sql);
        if (res.length === 0) throw new Error(["Error, no lectures found.", false]);
        const arr = res[0]['lecture_students'].split(")");
        const str = arr[0];

        const arr_check = res[0]['lecture_students'].replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "").split(",");
        let int_arr_check = [];
        arr_check.map((key) => int_arr_check.push(parseInt(key)));
        for (let i = 0; i < int_arr_check.length; i++) {
            if (student.student_id === int_arr_check[i]) throw new Error("Student has already entered the lecture. ");
        }
        sql = `UPDATE lectures SET lecture_students = '${str + "," + student.student_id + ")" }' WHERE lecture_id = ${res[0]['lecture_id']}`
        console.log(sql);
        res = await query(sql);
        if (res.length === 0) throw new Error(["Unexpected error occured while trying to append student. ", false]);
        return ["Sucessfully appended student to lecture. ", true];
    } catch(err) {
        console.log(`An error occured while trying to append student to active lecture. ${err}`);
    }
}

const handleRFIDScan = async(hex) => {
    try {
        const sql_ifteacher = `SELECT DISTINCT * from teachers WHERE teachers.teacher_hex = '${hex}'`;
        const res = await query(sql_ifteacher);
        
        const sql_has_concluded = `SELECT has_concluded FROM lectures ORDER BY lecture_id DESC LIMIT 1`;
        const res_has_concluded = await query(sql_has_concluded);
        if (res_has_concluded.length === 0) throw new Error("could not find a lecture. Please make sure that the lectures table isn't empty. ");

        const has_concluded = res_has_concluded[0]['has_concluded'];
        // Δεν ήταν hex από καθηγητή
        if (res.length === 0) {
            const sql_stud = `SELECT DISTINCT * from students WHERE students.student_hex = '${hex}'`;
            const stud_res = await query(sql_stud);
            if (stud_res.length === 0) throw new Error("student not found.");
            await appendStudentToActiveLecture(stud_res[0]);
        } 
        // Ήταν hex από καθηγητή
        else {
            const lecture_id = await query(`SELECT DISTINCT lecture_id FROM lectures ORDER BY lecture_id DESC LIMIT 1`)[0]['lecture_id'];
            if (has_concluded === 0) {
                const newLectureSchema = {
                    lecture_title: 'RFID_Scan - Physically Unable To Retrieve',
                    lecture_teacher: 'RFID_Scan - Physically Unable To Retrieve',
                    lecture_students: '',
                    lecture_date: new Date(),
                    has_concluded: false
                }
                await createLecture(newLectureSchema);
            } else {
                await query(`UPDATE lectures SET has_concluded = TRUE WHERE lecture_id = ${lecture_id}`);
            }
        }
    
    } catch(err) {
        return `Unexpected error occured whilst trying to scan RFID, ${err}`;
    }
}

module.exports = { createNewStudent, updateAbsences, createLecture, checkLecture,
     findStudentById, findLectureById, truncateStudents, truncateLectures, findStudentByHex, findTeacherByHex,
    initLectureByHex, updateLectureConcluded, createTeacher, handleRFIDScan};