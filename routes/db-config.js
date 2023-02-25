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
  // host: process.env.DATABASE_HOST,
  // user: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE,
});

module.exports = db;
