const router = require("express").Router();
const {
    check,
    validationResult
} = require("express-validator");
const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const handlebars = require('handlebars');
require('dotenv').config()

// SignUp
router.post("/signup", [
    check("email", "Please input a valid email")
    .isEmail(),
    check("password", "Please input a password with a min length of 6")
    .isLength({
        min: 6
    })
], async (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Validate the inputs 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }

    // Validate if the user doesn't already exist;
    let user = users.find((user) => {
        return user.email === email
    });

    if (user) {
        return res.status(422).json({
            errors: [{
                msg: "This user already exists",
            }]
        })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the password into the database
    users.push({
        email,
        password: hashedPassword
    });

    const token = await JWT.sign({
        email
    }, process.env.SECRET_TOKEN, {
        expiresIn: 360000
    });

    res.json({
        token
    })
})

// Get login page
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// login
router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body

    // Check if user with email exists
    let user = users.find((user) => {
        return user.email === email
    });

    if (!user) {
        return res.status(422).json({
            errors: [{
                msg: "Invalid Credentials",
            }]
        })
    }

    // Check if the password if valid
    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(404).json({
            errors: [{
                msg: "Invalid Credentials"
            }]
        })
    }

    // Send JSON web token
    const token = await JWT.sign({
        email
    }, process.env.SECRET_TOKEN, {
        expiresIn: 360000
    })

    res.json({
        token
    })
})


// Get all users
router.get("/all", (req, res) => {
    res.json(users)
})

module.exports = router