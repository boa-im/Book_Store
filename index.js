/*
 *   index.js
 *   Final
 *
 *   Revision History
 *      Boa Im, 2022.04.18: Created
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const Order = require("./models/Order");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/myOrder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var myApp = express();
myApp.use(bodyParser.urlencoded({ extended: false }));

myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');

myApp.get('/', function(req, res) {
    res.render('form');
});

var StudentIdRegex = /^[0-9]{7}$/;

function checkRegex(userInput, regex) {
    if (regex.test(userInput))
        return true;
    else
        return false;
}

function customStudentIdValidation(value) {
    if (!checkRegex(value, StudentIdRegex)) {
        throw new Error('StudentID is 7 digits!');
    }
    return true;
}

myApp.post('/', [
    check('name', 'Must have a name').not().isEmpty(),
    check('studentid').custom(customStudentIdValidation),
    check('html5', 'Html5 Books cannot be empty. If you don\'t want to buy it please enter 0').not().isEmpty(),
    check('css3', 'Css3 Books cannot be empty. If you don\'t want to buy it please enter 0').not().isEmpty(),
    check('pen', 'Pens cannot be empty. If you don\'t want to buy it please enter 0').not().isEmpty(),
], function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('form', {
            errors: errors.array()
        });
    } else {
        var name = req.body.name;
        var studentid = req.body.studentid;
        var html5 = req.body.html5;
        var css3 = req.body.css3;
        var pen = req.body.pen;
        var subtotal = parseInt(req.body.html5) * 62.99 + parseInt(req.body.css3) * 51.99 + parseInt(req.body.pen) * 2.99;
        var pageData = {
            name: name,
            studentid: studentid,
            html5: html5,
            css3: css3,
            pen: pen,
            subtotal: subtotal,
            tax: (subtotal * 0.13).toFixed(2),
            total: (subtotal * 1.13).toFixed(2)
        };
        // create an object for the model Order
        var myOrder = new Order(pageData);
        // save the order
        // function().then().catch()
        myOrder
            .save()
            .then(function() {
                res.render("form", pageData);
            })
            .catch((err) => {
                console.log(err);
                res.render("NotFound");
            });
        // display receipt
    }
});

myApp.get("/allorders", function(req, res) {
    Order.find().exec(function(err, orders) {
        res.render("allorders", { orders: orders });
    });
});

myApp.listen(8080);