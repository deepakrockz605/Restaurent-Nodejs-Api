const express = require("express");
const login = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

login.use(cors({ credentials: true }));
login.options("*", cors());

login.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

login.use(bodyParser.json());

login.post("/login", (req, res) => {
  const { username, password } = req.body;
  let sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, result) => {
    if (err) {
      res.json({ err });
    }
    if (result.length > 0) {
      const hashedPassword = await bcrypt.compare(password, result[0].Password);
      if (hashedPassword) {
        const userData = result[0];
        const token = jwt.sign(
          { id: userData.UserID },
          process.env.SECRET_KEY,
          { expiresIn: 1000 * 60 * 5 }
        );
        
        res.json({
          status: 200,
          message: "Login Successfull !!",
          token,
          userData: {
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Email: userData.Email
          },
          success: true,
        });
      } else {
        res.json({
          status: 401,
          success: false,
          message: "Incorrect Username and / or Password !!",
        });
      }
    } else {
      res.json({
        status: 401,
        success: false,
        message: "Incorrect Username and / or Password !!",
      });
    }
  });
});

module.exports = login;
