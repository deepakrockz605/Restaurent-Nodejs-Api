const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const db = require("./routes/db-config");
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT}`);
});

app.get('/', (req,res) => {
  res.send('Hello Deepak')
})

var Users = require("./controllers/users");
app.use("/users", Users);
