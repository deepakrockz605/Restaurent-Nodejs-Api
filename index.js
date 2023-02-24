const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const db = require("./routes/db-config");
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

db.connect((err) => {
  if (err) throw err;
  console.log("Database Connected");
});

app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT}`);
});

var Users = require("./controllers/users");
app.use("/users", Users);
