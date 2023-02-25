const express = require("express");
const login = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

login.use(cors());
login.options('*', cors());
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
        const token = jwt.sign(
          { id: result[0].UserID },
          process.env.SECRET_KEY,
          { expiresIn: "10s" }
        );
        res.json({ status: 200, message: "Login Successfull !!", token, userId: result[0].UserID, success: true });
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
