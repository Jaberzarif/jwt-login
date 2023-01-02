const router = require('express').Router();
const {
    check,
    validationResult
} = require('express-validator');
const {
    users
} = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router.post('/signup', [
    check("email", "Please provide a valid email")
    .isEmail(),
    check("password", "Please provide a password is geather than 5 character")
    .isLength({
        min: 6,
    })
], async (req, res) => {

    const {
        email,
        password
    } = req.body;

    // Validated the input
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    // Validate if user doesn't already exist

    let user = users.find((user) => {
        return user.email === email
    });

    if (user) {
        return res.status(400).json({
            errors: [{
                msg: "This user already exists",
            }]
        })
    }

    // Hash the password
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);


    // Save the password into the database
    users.push({
        email,
        password: hashedPassword
    });

    const token = await JWT.sign({
        email
    }, "fn32iuhf392hfg3279gh239ghnvh82", {
        expiresIn: 360000
    })

    res.json({
        token
    });

})


//

router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    let user = users.find((user) => {
        return user.email === email
    })

    if (!user) {
        return res.status(400).json({
            errors: [{
                msg: "Invalid Credentials",
            }]
        })
    }


    let isMatch = bcrypt.compare(password, user.password);


    if (!isMatch) {
        return res.status(400).json({
            errors: [{
                msg: "Invalid Credentials",
            }]
        })
    }

    const token = await JWT.sign({
        email
    }, "fn32iuhf392hfg3279gh239ghnvh82", {
        expiresIn: 360000
    })

    res.json({
        token
    });

})
// Get all users
router.get('/all', (req, res) => {
    res.json(users);
})


module.exports = router;