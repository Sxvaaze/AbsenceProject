const dbfunc = require('./util/dbFunctions.js');

const express = require('express');
const cors = require('cors');
const app = express();

const port = 4096;


app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log('API Initialized.');
})

const base_url = '/api';

app.get(`${base_url}/createStudent`, (req, res) => {
    const param_count = Object.keys(req.query).length;
    try {
        if (param_count !== 4) throw new Error('Expected 4 query parameters.');
        const keys = Object.keys(req.query);

        let found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'absences') found = true;
        }
        if (!found) throw new Error('Expected (absences) as query parameter.');

        found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'fullname') found = true;
        }
        if (!found) throw new Error('Expected (fullname) as query parameter.');

        found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'grade') found = true;
        }
        if (!found) throw new Error('Expected (grade) as query parameter.');

        found = false;
        for (let i = 0; i < 4 && !found; i++) {
            if (keys[i] === 'student_lectures') found = true;
        }
        if (!found) throw new Error('Expected (student_lectures) as query parameter.');

        const newStudentSchema = {
            absences: parseInt(req.query['absences']),
            fullname: req.query['fullname'],
            grade: req.query['grade'],
            student_lectures: req.query['student_lectures'].replace(/["']/g, '').split(",")
        }
        dbfunc.createNewStudent(newStudentSchema);
        res.status(200).json(newStudentSchema);
    } catch(err) {
        console.log(`An error occured whilst trying to GET ${base_url}/createStudent. Error: ${err}`)
    }
    
})

app.get(`${base_url}/updateAbsences`, (req, res) => {
    const param_count = Object.keys(req.query).length;
    try {
        if (param_count !== 2) throw new Error('Expected 2 query parameters.');
        const keys = Object.keys(req.query);
        if (keys[0] !== 'student_id' && keys[1] !== 'student_id') throw new Error('Expected (student_id) as query parameter.');
        if (keys[0] !== 'quantity' && keys[1] !== 'quantity') throw new Error('Expected (quantity) as query parameter.');
        dbfunc.updateAbsences(req.query['student_id'], parseInt(req.query['quantity']));
    } catch(err) {
        console.log(`An error occured whilst trying to GET ${base_url}/updateAbsences. Error: ${err}`)
    }
    res.status(200).json(req.query);
});