const express = require("express");
const cors = require("cors");
const users = express.Router();
const bodyParser = require("body-parser");
const register = require('./register');
const login = require('./login');
const passwordReset = require('./passwordReset');
const fetchUsers = require('./fetchUsers');
const fetchFiles = require('./fetchFiles');

const multer  = require('multer')

const upload = multer({ dest: 'public/uploads' })

process.env.SECRET_KEY = "secret";
users.use(cors({ credentials: true }))

process.env.SECRET_KEY = "secret";

users.use(bodyParser.json());

users.use('/public/uploads', express.static('public/uploads'))

users.post("/register", register);

users.post("/login", login);

users.post("/reset-password", passwordReset);
users.post("/update-password", passwordReset);

users.get("/fetch-users", fetchUsers);
users.delete("/delete-user/:id", fetchUsers);

users.post('/upload-product',upload.single('image'), fetchFiles)
users.get('/get-products', fetchFiles) 


module.exports = users;
