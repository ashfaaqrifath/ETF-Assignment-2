const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'));
app.use(express.json());


//--------------------------------------------------------------------------------

// add new students (post method)
app.post('/student', (req, res) => {
    const new_student = req.body;

    fs.readFile('students.json', 'utf8', (err, data) => {

        if (err) {
            console.error(err);
            res.status(500).send('Error occurred.');
        }
        
        else {
            const students = JSON.parse(data);
            students.push(new_student);

            fs.writeFile('students.json', JSON.stringify(students, null, 2), (err) => {

                if (err) {
                    console.error(err);
                    res.status(500).send('Error occurred.');
                }
                else {
                    res.status(200).send('Saved successfully');
                }

            });
        }
    });
});


//--------------------------------------------------------------------------------


//view all students (get method)
app.get('/student', (req, res) => {

    fs.readFile('students.json', 'utf8', (err, data) => {

        if (err) {
            console.error(err);
            res.status(500).send('Error occurred.');
        }
        
        else {
            const students = JSON.parse(data);
            res.status(200).send(students);
        }

    });
});



//--------------------------------------------------------------------------------




// Update student (put method)
app.put('/student/:sid', (req, res) => {
    const sid = req.params.sid;

    const updated_student = req.body;
    fs.readFile('students.json', 'utf8', (err, data) => {

        if (err) {
            console.error(err);
            res.status(500).send('Error occurred.');
        }
        
        else {
            let students = JSON.parse(data);

            const index = students.findIndex(student => student.sid == sid);
            if (index !== -1) {
                students[index] = updated_student;

                fs.writeFile('students.json', JSON.stringify(students, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('An error occurred while writing to the file.');
                    }
                    
                    else {
                        res.status(200).send('Updated successfully');
                    }
                });
            }

            else {
                res.status(404).send('Student not found');
            }
        }
    });
});



//--------------------------------------------------------------------------------





// Search by types (post method)
app.post('/search', (req, res) => {
    const searchType = req.body.searchType;
    const searchValue = req.body.searchValue.toLowerCase();

    fs.readFile('students.json', (err, data) => {
        if (err) throw err;
        let studentDetails = JSON.parse(data);
        let status = { found: false };

        for (let student of studentDetails) {
            if (Array.isArray(student[searchType])) {
                if (student[searchType].some(item => item.toLowerCase() === searchValue)) {
                    status = { found: true, student: student };
                    break;
                }
            } else {
                if (String(student[searchType]).toLowerCase() === searchValue) {
                    status = { found: true, student: student };
                    break;
                }
            }
        }

        res.json(status);
    });
});




//--------------------------------------------------------------------------------




// Delete a student
app.delete('/student/:sid', (req, res) => {
    const sid = req.params.sid;

    fs.readFile('students.json', 'utf8', (err, data) => {

        if (err) {

            console.error(err);
            res.status(500).send('Error occurred.');
        }
        
        else {
            let students = JSON.parse(data);

            const index = students.findIndex(student => student.sid == sid);

            if (index !== -1) {
                students.splice(index, 1);

                fs.writeFile('students.json', JSON.stringify(students, null, 2), (err) => {

                    if (err) {
                        console.error(err);
                        res.status(500).send('Error occurred.');
                    }
                    
                    else {
                        res.status(200).send('Deleted successfully');
                    }
                });
            }
            
            else {
                res.status(404).send('Student not found');
            }
        }
    });
});



//--------------------------------------------------------------------------------



app.listen(3000, () => {
    console.log('Server is active --> http://localhost:3000');
});