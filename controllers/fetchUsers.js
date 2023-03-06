const express = require("express");
const fetchUsers = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

fetchUsers.use(cors({
    credentials: true
}));
fetchUsers.options("*", cors());

fetchUsers.use(bodyParser.json());

fetchUsers.get("/fetch-users", (req, res) => {
    let token = req.headers['authorization'];
    const isTokenVerified = tokenVerification(token)
    if (isTokenVerified) {
        let sql = "SELECT FirstName, LastName, Email, UserName, UserID FROM users WHERE role = 'Visitor'";
        db.query(sql, async (err, result) => {
            if (err) {
                res.json({
                    err
                });
            }
            res.json({
                status: 200,
                result,
                success: true,
            });
        });
    } else {
        res.json({
            status: 401,
            success: false,
            message: "Session Expired. Please Login again !!",
        });
    }
});

fetchUsers.delete('/delete-user/:id', (req, res) => {
    let token = req.headers['authorization'];
    const isTokenVerified = tokenVerification(token)
    if (isTokenVerified) {
        const id = req.params.id;
        var deleteUserQuery = 'DELETE FROM users WHERE UserID = ?';
        db.query(deleteUserQuery, [id], function (err, data) {
            if (err) throw err;
            let fetchUdatedUsersQuery = "SELECT FirstName, LastName, Email, UserName, UserID FROM users WHERE role = 'Visitor'";
            db.query(fetchUdatedUsersQuery, async (err, result) => {
                if (err) {
                    res.json({
                        err
                    });
                }
                res.json({
                    status: 200,
                    result,
                    success: true,
                });
            });
        });
    } else {
        res.json({
            status: 401,
            success: false,
            message: "Session Expired. Please Login again !!",
        });
    }
})

const tokenVerification = async (token) => {
    const bearer = token.split(' ')
    const bearerToken = bearer[1];
    if (bearerToken) {
        try {
            let data = await jwt.verify(bearerToken, process.env.SECRET_KEY);
            if (data) {
                return true
            }
        } catch (err) {
            return false
        }
    }
}

module.exports = fetchUsers;
