const express = require("express");
const register = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

register.use(cors());

process.env.SECRET_KEY = "secret";

register.use(bodyParser.json());

register.post("/register", (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  let isUserAlready = "SELECT * from users WHERE username = ? OR email = ?";
  db.query(isUserAlready, [username, email], async (err, result) => {
    if (err) {
      res.json({ err });
    }
    if (result.length > 0) {
      res.json({ status: 401, message: "Username or Email Exists Already !", success: false, });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      var user = {
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
      };
      db.query("INSERT INTO users SET ?", user, (err2) => {
        if (err2) {
          res.json({ err2 });
        } else {
          res.json({
            status: 200,
            success: true,
            message:
              firstname +
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
