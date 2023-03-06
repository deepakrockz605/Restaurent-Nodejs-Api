const express = require("express");
const register = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

register.use(cors({
  credentials: true
}))
register.options('*', cors());

register.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

process.env.SECRET_KEY = "secret";

register.use(bodyParser.json());

const sendMail = async (user, text) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.DUMMY_EMAIL_SENDER,
      pass: process.env.DUMMY_PASSWORD
    }
  });

  var mailOptions = {
    from: 'Test',
    to: `${user.email}`,
    subject: 'Account Registration',
    text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

register.post("/register", (req, res) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    role
  } = req.body;

  let isUserAlready = "SELECT * from users WHERE username = ? OR email = ?";
  db.query(isUserAlready, [username, email], async (err, result) => {
    if (err) {
      res.json({
        err
      });
    }
    if (result && result.length > 0) {
      res.json({
        status: 401,
        message: "Username or Email Exists Already !",
        success: false,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password || 'Test123', 10);
      var user = {
        firstname,
        lastname,
        username,
        email,
        role: role ? role : 'Visitor',
        password: hashedPassword,
      };
      db.query("INSERT INTO users SET ?", user, (err2) => {
        if (err2) {
          res.json({
            err2
          });
        } else {
          const text = `Dear ${user.firstname}${' '}${user.lastname} You have succesfully registered to Delicious Restaurant. Please Login with the credentials to continue Online Food Order. Happy Hunger !!`
          sendMail(user, text)

          res.json({
            status: 200,
            success: true,
            message: firstname +
              " " +
              lastname +
              " Your Email ID : " +
              email +
              " Registred Successfully !!",
          });
        }
      });
    }
  });
});

module.exports = register;
