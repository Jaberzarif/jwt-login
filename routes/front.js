const router = require("express").Router();
const {
    check,
    validationResult
} = require("express-validator");
const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const handlebars = require('handlebars');
require('dotenv').config()



router.get('/', (req, res) => {
    res.render('client/', {
        layout: 'client_layout',
    })
})