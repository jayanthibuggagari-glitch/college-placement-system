
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

// Port for College Placement System
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public folder path
const publicPath = path.join(__dirname, 'public');

// Serve HTML, CSS, JS files
app.use(express.static(publicPath));

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Students API
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Students Error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Unable to fetch students'
            });
        }

        res.json(result);
    });
});

// Companies API
app.get('/companies', (req, res) => {
    const sql = 'SELECT * FROM companies';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Companies Error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Unable to fetch companies'
            });
        }

        res.json(result);
    });
});

// Jobs API
app.get('/jobs', (req, res) => {
    const sql = `
        SELECT jobs.*, companies.company_name
        FROM jobs
        JOIN companies
        ON jobs.company_id = companies.company_id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Jobs Error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Unable to fetch jobs'
            });
        }

        res.json(result);
    });
});

// Applications API
app.get('/applications', (req, res) => {
    const sql = `
        SELECT applications.*,
               students.name,
               companies.company_name,
               jobs.job_title
        FROM applications
        JOIN students
        ON applications.student_id = students.student_id
        JOIN jobs
        ON applications.job_id = jobs.job_id
        JOIN companies
        ON jobs.company_id = companies.company_id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Applications Error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Unable to fetch applications'
            });
        }

        res.json(result);
    });
});

// 404 page
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start server
app.listen(PORT, () => {
    console.log('------------------------------------');
    console.log('CareerConnect Server Started!');
    console.log(`Website: http://localhost:${PORT}`);
    console.log(`Home: http://localhost:${PORT}/index.html`);
    console.log('------------------------------------');
});
