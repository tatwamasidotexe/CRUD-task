const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Student = require('./models/Student'); // Assuming Student model is defined in Student.js

const app = express();
const port = 3000; // or any port you prefer

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect("mongodb+srv://ttm:<password>@cluster0.r72fjz7.mongodb.net/STL?retryWrites=true&w=majority")
    .then(() => {
        console.log("Mongoose connected.");
    })
    .catch(console.error);

// Define routes

// Handle form submission to add a new student
app.post('/submit-form', async (req, res) => {
    try {
        const { username, phone, email } = req.body;
        const student = new Student({ username, phone, email });
        const savedStudent = await student.save();
        res.status(200).json(savedStudent);
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Fetch all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({}, { __v: 0 });
        console.log(students);
        res.json(students);
    } catch (err) {
        console.error('Error fetching student data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update student information
app.put('/update-student/:id', async (req, res) => {
    try {
        const { username, phone, email } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { username, phone, email }, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).send('Internal Server Error');
    }
}); 

// Route to handle DELETE request for deleting a student
app.delete('/delete-student/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Student.deleteOne({ _id: id });
        res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
app.listen(port, () => {
    console.log("Server running on port: " + port)
});