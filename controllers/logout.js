const express = require("express");
const logout = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

logout.use(cors());

logout.use(bodyParser.json());

logout.post("/logout", (req, res) => {
  if (req.userId) {
    delete req.userId;
    res.json({ result: "SUCCESS" });
  } else {
    res.json({ result: "ERROR", message: "User is not logged in." });
  }
});

module.exports = logout;
