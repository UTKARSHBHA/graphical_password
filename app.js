// import signupData from './public/main';
// let http = require('http');

//alert 
let alert = require('alert');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer');
// const path = require('path')
const router = express.Router()

const app = express()
app.use(express.static('public'));
const port = process.env.PORT || 5000;
// const open = require('open');

// const { signupData } = require('./public/main.js');
// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false })); // Remove 
app.use(express.urlencoded({ extended: true })); // New
// Parse application/json
// app.use(bodyParser.json()); // Remove
app.use(express.json()); // New


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
// app.post("/", (req, res) => {
//     console.log(req.body);
//     // res.send(200);
// })
//fetch trial




// MySQL Code goes here

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sql_login'
});

app.post('/signup', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    db.query('SELECT email from users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            if (results.length > 0) {
                console.log("email present already");
                // return res.sendFile(__dirname + "/index.html", {
                //     message: 'The email is already in use'
                // })
                // return res.sendStatus(100);
                res.statusCode = 401;
                res.send("email already registered");
            }
            else {
                let hashedPassword = await bcrypt.hash(password, 8);
                console.log(hashedPassword);

                db.query('INSERT INTO users SET ?', { email: email, password: hashedPassword }, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // return res.sendFile(__dirname + "/index.html", {
                        //     message: 'User registered'
                        // });
                        res.send("Form submitted");
                    }
                })
            }
        }


    })
}
)

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).sendFile(__dirname + "/index.html", {
                message: "Please Provide an email and password"
            })
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            console.log(results);
            if (!results || !await bcrypt.compare(password, results[0].password)) {
                res.status(401).sendFile(__dirname + '/index.html', {
                    message: 'Email or Password is incorrect'
                })
            } else {
                console.log("correct password");
                // res.status(200).redirect("https://www.google.com/");
                // res.sendStatus(200);
                res.send("success");
            }
        })
    } catch (err) {
        console.log(err);
    }
})




// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'sql_login'
// })



// app.post('/signup', (req, res) => {
//     console.log(req.body)
//     pool.getConnection((err, connection) => {
//         if (err) throw err

//         const params = req.body
//         console.log(params.password);
//         connection.query('INSERT INTO users SET ?', params, (err, rows) => {
//             connection.release() 
//             if (!err) {
//                 res.sendStatus(200);
//             } else {
//                 console.log(err)

//             }

//         })
//     })
// });


// let signuppas;
// let loginpas;
// app.post('/signin', (req, res) => {
//     pool.getConnection((err, connection) => {
//         if (err) throw err
//         connection.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err, rows) => {
//             connection.release()
//             if (!err) {
//             } else {
//                 console.log(err)
//             }
//             signuppas = rows[0].password;
//             loginpas = req.body.password;
//             console.log(signuppas);
//             console.log(loginpas);
//         })
//     })
//     if (signuppas === loginpas) {
//         var myText = "Login is successful";
//         console.log(myText);
//         alert("correct password");
//     }
//     else {
//         alert("incorrect password");
//     }

// });






// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))