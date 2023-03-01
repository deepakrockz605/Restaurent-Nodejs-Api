const dotenv = require('dotenv').config()
const sql = require("mysql");

const db = sql.createPool({
  host: 'db4free.net',
  port:3306,
  user: 'deepak',
  password: 'Deepak@123',
  database: 'restaurent',
  connectionLimit: 100,
  multipleStatements: true
});

module.exports = db;
