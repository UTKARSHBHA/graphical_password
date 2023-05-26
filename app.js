
let alert = require('alert');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer');
const router = express.Router()

const app = express()
app.use(express.static('public'));
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // New


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});





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
                res.send("success");
            }
        })
    } catch (err) {
        console.log(err);
    }
})




// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))