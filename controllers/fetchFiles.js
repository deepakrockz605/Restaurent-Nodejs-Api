const express = require("express");
const fetchFiles = express.Router();
const cors = require("cors");
const db = require("../routes/db-config");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

fetchFiles.use(cors({
    credentials: true
}));
fetchFiles.options("*", cors());

fetchFiles.use(bodyParser.json());

fetchFiles.put('/update-product', (req, res) => {
    const {
        Id
    } = req.body;
    let isProductAvailable = "SELECT * from foodProducts WHERE Id = ?";
    db.query(isProductAvailable, [Id], async (err, result) => {
        if (err) {
            res.json({
                err
            });
        }
        if (result && result.length > 0) {
            let isTitleAlready = "SELECT * from foodProducts WHERE Title = ?"
            db.query(isTitleAlready, [req.body.title], async (err, results) => {
                if (err) {
                    res.json({
                        err
                    });
                }
                if (results && results.length > 0 && results[0].Id != Id) {
                    res.json({
                        status: 401,
                        message: "Product with the same title already exists. Please upload the product with different Title !",
                        success: false,
                    });
                } else {
                    db.query('UPDATE foodProducts SET ? WHERE ?', [{
                        Title: req.body.title,
                        info: req.body.productInfo,
                        Price: req.body.discountedPrice,
                        StrikePrice: req.body.originalPrice,
                        ProductType: req.body.productType,
                        Category: req.body.productCategory,
                        Availability: req.body.availability === 'true' ? 1 : 0,
                        File: req.file ? req.file.path : result[0].File
                    }, {
                        Id: Id
                    }], async (err, result) => {
                        if (err) {
                            res.json({
                                err
                            });
                        } else {
                            res.json({
                                status: 200,
                                success: true,
                                message: 'Product Updated Succesfully !!',
                            });
                        }
                    })
                }
            })

        }
    })
})

fetchFiles.post("/upload-product", (req, res) => {
    const {
        title
    } = req.body;

    let isProductAlready = "SELECT * from foodProducts WHERE title = ?";
    db.query(isProductAlready, [title], async (err, result) => {
        if (err) {
            res.json({
                err
            });
        }
        if (result && result.length > 0) {
            res.json({
                status: 401,
                message: "Product with the same title already exists. Please upload the product with different Title !",
                success: false,
            });
        } else {
            if (req.file) {
                var product = {
                    Title: title,
                    info: req.body.productInfo,
                    Price: req.body.discountedPrice,
                    StrikePrice: req.body.originalPrice,
                    ProductType: req.body.productType,
                    Category: req.body.productCategory,
                    Availability: req.body.availability ? 1 : 0,
                    File: req.file.path
                };
                db.query("INSERT INTO foodProducts SET ?", product, (err2) => {
                    if (err2) {
                        res.json({
                            err2
                        });
                    } else {
                        res.json({
                            status: 200,
                            success: true,
                            message: 'Product Added Succesfully !!',
                        });
                    }
                });
            }
        }
    })


});

fetchFiles.get('/get-products', (req, res) => {
    let token = req.headers['authorization'];
    const isTokenVerified = tokenVerification(token)
    if (isTokenVerified) {
        let sql = "SELECT * FROM foodProducts";
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

module.exports = fetchFiles;
