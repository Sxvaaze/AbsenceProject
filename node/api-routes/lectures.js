const dbfunc = require('../util/dbFunctions.js');

const express = require('express')
const router = express.Router()

router.get(`/createLecture`, async(req, res) => {
    const param_count = Object.keys(req.query).length;
    try {
        if (param_count !== 4) throw new Error('Expected 4 query parameters.');
        const keys = Object.keys(req.query);

        let found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'lecture_title') found = true;
        }
        if (!found) throw new Error('Expected (lecture_title) as query parameter.');

        found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'lecture_teacher') found = true;
        }
        if (!found) throw new Error('Expected (lecture_teacher) as query parameter.');

        found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'lecture_students') found = true;
        }
        if (!found) throw new Error('Expected (lecture_students) as query parameter.');

        found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'lecture_date') found = true;
        }
        if (!found) throw new Error('Expected (lecture_date) as query parameter.');

        let date = new Date();
        date = date.getFullYear() + '-' +
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' + 
        ('00' + date.getHours()).slice(-2) + ':' + 
        ('00' + date.getMinutes()).slice(-2) + ':' + 
        ('00' + date.getSeconds()).slice(-2);

        const newLectureSchema = {
            lecture_title: req.query['lecture_title'],
            lecture_teacher: req.query['lecture_teacher'],
            lecture_students: req.query['lecture_students'],
            lecture_date: date
        }

        await dbfunc.createLecture(newLectureSchema, req.body.mode);
        res.status(200).json(newLectureSchema);
    } catch(err) {
        console.log(`An error occured whilst trying to GET /createLecture. Error: ${err}`)
        res.status(500).json("An error occured while trying to create lecture, please check devlogs. ");
    }
})

router.get(`/concludeLecture`, async(req, res) => {
    try {
        const r = await dbfunc.createLecture({}, "close");
        res.status(200).json(r);
    } catch(err) {
        console.log(`An error occured whilst trying to GET /concludeLecture. Error: ${err}`)
        res.status(500).json("An error occured while trying to conclude lecture, please check devlogs. ");
    }
})

router.get(`/appendStudent`, async(req, res) => {
    const param_count = Object.keys(req.query).length;
    try {
        if (param_count !== 1) throw new Error('Expected (student_id) as query parameter. ');
        const keys = Object.keys(req.query);
        if (keys[0] !== 'student_id') throw new Error('Expected (student_id) as query parameter. ');
        const res = await dbfunc.appendStudentToActiveLecture(req.query['student_id']);
        res.status(200).json(res);
    } catch(err) {
        console.log(`An error occured whilst trying to GET /appendStudent. Error: ${err}`)
        res.status(500).json("An error occured while trying to append student, please check devlogs. ");
    }
})

router.get(`/findLecture`, async(req, res) => {
    const param_count = Object.keys(req.query).length;
    try {
        if (param_count !== 1) throw new Error("Expected 1 query parameter.");
        const keys = Object.keys(req.query);
        if (keys[0] !== 'lecture_id') throw new Error('Expected (lecture_id) as query parameter. ');

        const lecture = await dbfunc.findLectureById(req.query['lecture_id']);
        if (typeof lecture === "undefined") res.status(200).json(`Could not find lecture with id ${req.query['lecture_id']}. `);
        res.status(200).json(lecture);
    } catch(err) {
        console.log(`An error occured whilst trying to GET /createLectures. Error: ${err}`)
        res.status(500).json("An error occured while trying to find lecture, please check devlogs. ");
    }
})

router.get(`/truncateLectures`, async(req, res) => {
    try {
        await dbfunc.truncateLectures();
        res.status(200).json("Lectures successfully truncated. ");
    } catch(err) {
        console.log(`An error occured whilst trying to GET /createLectures. Error: ${err}`)
        res.status(500).json("An error occured while trying to truncate lectures, please check devlogs. ");
    }
})

module.exports = router;