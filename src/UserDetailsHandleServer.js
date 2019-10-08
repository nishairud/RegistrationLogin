const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const url = require('url');;
const request = require('request');
var mysql = require('mysql');
app.listen(port, () => console.log(`Listening on port ${port}`));

//CORS- if not added it will not listen from the React LoginForm.js(3001 server)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "userDetails"
});
//To check whether the login details of the user is eligible
app.get('/login/userEligibility', (req, res) => {
    con.connect();
    con.query('select exists(select 1 from userDetails where email=? and password= ? and verifiedUser="Y")', function (error, results, fields) {
        if (error) throw error;
        console.log('result', results);
        if (results && results.length > 0) {
            res.json(results[0]);
        }
    })
});

//To select details of user to display in Home Page
app.get('/login/fetchDetails', (req, res) => {
    con.connect();
    con.query('select name, dob from userDetails where email=?', function (error, results, fields) {
        if (error) throw error;
        console.log('result', results);
        if (results && results.length > 0) {
            res.json(results[0]);
        }
    })
});

//To check if the emailID is unique
app.get('/register/checkEmailUniqueness', (req, res) => {
    con.connect();
    con.query('select exists(select 1 from userDetails where email=?)', function (error, results, fields) {
        if (error) throw error;
        console.log('result', results);
        if (results && results.length > 0) {
            res.json(results[0]);
        }
    })
});


//To insert New user 
app.use(express.json());
app.post('/register/addUser', function (req, res) {

    
    console.log("request input",req.body);
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
    var userDetail = {
        email: req.body.email,
        password: req.body.password,
        name:req.body.name,
        dob:req.body.dob,
        verificationCode: req.body.verificationCode;
        verifiedUser: 'N',
        emailSent: 'N'

    }
    con.query('INSERT INTO userdetails SET ?', userDetail, function (error, result) {
        if (error) throw error;
        console.log(result);
        res.end(JSON.stringify(result));
    });
    con.end()
});

//To update after sending the verificationCode to the user's email address
app.post('/register/updateEmailSent', function (req, res) {

    console.log("inside updateEmailSent post of 5000 server");
    console.log(req.body);
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
    var person = {
        emailSent: req.body.emailSent,
        email: req.body.email
      }
    var updateEmailSent =[emailSent, email];
    con.query('UPDATE userdetails SET emailSent =? where email= ?', memberDetails, function (error, result, fields) {
        if (error) throw error;
        console.log(result);
        res.end(JSON.stringify(result));
    });
    con.end();
});


//To get the verificationCode that was generated for the user
app.get('/register/getVerificationCode', (req, res) => {
    con.connect();
    con.query('select verificationCode from userDetails where email=?', function (error, results, fields) {
        if (error) throw error;
        console.log('result', results);
        if (results && results.length > 0) {
            res.json(results[0]);
        }
    })
});


//To update after sending the verificationCode to the user's email address
app.post('/register/verifyUser', function (req, res) {

    console.log("inside verifyUser post of 5000 server",req.body);
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
    var person = {
        verifiedUser: 'Y',
        email: req.body.email
      }
    var updateEmailSent =[verifiedUser, email];
    con.query('UPDATE userdetails SET verifiedUser =? where email= ?', memberDetails, function (error, result, fields) {
        if (error) throw error;
        console.log(result);
        res.end(JSON.stringify(result));
    });
    con.end();
});

