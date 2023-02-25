const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const db = require("./routes/db-config");
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT}`);
});
app.use(cors({ credentials: true }))

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req,res) => {
  res.send('Hello Deepak')
})

app.all('/', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

var Users = require("./controllers/users");
app.use("/users", Users);
