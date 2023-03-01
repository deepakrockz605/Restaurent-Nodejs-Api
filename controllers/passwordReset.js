const express = require("express");
const passwordReset = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

passwordReset.use(cors({
    credentials: true
}));
passwordReset.options("*", cors());


passwordReset.use(bodyParser.json());

passwordReset.post("/reset-password", (req, res) => {
    const {
        email
    } = req.body;
    let sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) {
            res.json({
                err
            });
        }
        if (result.length > 0) {
            const token = jwt.sign({
                    id: result[0].UserID
                },
                process.env.SECRET_KEY, {
                    expiresIn: '2m'
                }
            );
            res.json({
                status: 200,
                token,
                message: `Please update password for ${email}.`,
                success: true,
                userId: result[0].UserID
            });
        } else {
            res.json({
                status: 401,
                success: false,
                message: "Incorrect Email !!",
            });
        }
    });
});

passwordReset.post("/update-password", async (req, res) => {
    const { password, userId } = req.body;
    let token = req.headers['authorization'];
    const bearer = token.split(' ')
    const bearerToken = bearer[1];
    if (bearerToken) {
        try {
            let data = await jwt.verify(bearerToken, process.env.SECRET_KEY);
            const hashedPassword = await bcrypt.hash(password, 10);
            var updateQuery = "UPDATE users SET Password = ? WHERE UserID  = ?"
            db.query(updateQuery, [hashedPassword, userId], async (err, result) => {
                if (err) {
                    res.json({
                        err
                    });
                }
                res.json({
                    status: 200,
                    token,
                    message: `Password Updated`,
                    success: true,
                });
            });
        } catch (err) {
            res.json({
                status: 401,
                success: false,
                message: "Session Expired. Please Login again !!",
            });
        }
    } else {
        res.json({
            status: 401,
            success: false,
            message: "Session Expired. Please Login again !!",
        });
    }
});

module.exports = passwordReset;
