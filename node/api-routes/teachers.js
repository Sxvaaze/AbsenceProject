const dbfunc = require('../util/dbFunctions.js');

const express = require('express')
const router = express.Router()

router.get(`/createTeacher`, async(req, res) => {
    try {
        const param_count = Object.keys(req.query).length;
        if (param_count !== 2) throw new Error("Expected 2 query parameters. ");
        const keys = Object.keys(req.query);
        if (keys[0] !== 'teacher_name' && keys[1] !== 'teacher_name') throw new Error('Expected (teacher_name) as query parameter.');
        if (keys[0] !== 'teacher_hex' && keys[1] !== 'teacher_hex') throw new Error('Expected (teacher_hex) as query parameter.');

        const newTeacherSchema = {
            teacher_name: req.query['teacher_name'],
            teacher_hex: req.query['teacher_hex']
        }
        await dbfunc.createTeacher(newTeacherSchema);
        res.status(200).json(newTeacherSchema);
    } catch (err) {
        console.log(`An error occured whilst trying to GET /createTeacher. Error: ${err}`);
        res.status(500).json("An error occured while trying to create teacher, please check devlogs. ");
    }
})

module.exports = router;