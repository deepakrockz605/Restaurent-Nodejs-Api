const dotenv = require('dotenv').config()
const sql = require("mysql");

const db = sql.createPool({
  host: process.env.DATABASE_HOST,
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 100,
  multipleStatements: true
});

module.exports = db;
