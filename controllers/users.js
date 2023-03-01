const express = require("express");
const cors = require("cors");
const users = express.Router();
const bodyParser = require("body-parser");
const register = require('./register');
const login = require('./login');
const passwordReset = require('./passwordReset');
const logout = require('./logout');
process.env.SECRET_KEY = "secret";
users.use(cors({ credentials: true }))

users.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

process.env.SECRET_KEY = "secret";

users.use(bodyParser.json());

users.post("/register", register);

users.post("/login", login);

users.post("/login", login);

users.post("/reset-password", passwordReset);
users.post("/update-password", passwordReset);

module.exports = users;
