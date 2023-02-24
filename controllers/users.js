const express = require("express");
const cors = require("cors");
const users = express.Router();
const bodyParser = require("body-parser");
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
process.env.SECRET_KEY = "secret";
users.use(cors());

process.env.SECRET_KEY = "secret";

users.use(bodyParser.json());

users.post("/register", register);

users.post("/login", login);

users.post("/logout", logout);

module.exports = users;
