var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const storage = multer.memoryStorage();
const upload = multer({storage})

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* POST user registration */
router.post('/register', (req,res,next) => {
    User.findOne({Email:req.body.email}, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.status(403).json({
                message: 'Email already exists'
            });
        }
        // Generate salt and hash password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                User.create({
                    Username: req.body.username,
                    Password: hash,
                    Email: req.body.email,
                    Posts: [],
                    Comments: [],
                    DateCreated: Date.now()
                }, (err, user) => {
                    if (err) throw err;
                    res.json({
                        message: 'User created'
                    });
                });
            });
        });
    });
});

/* POST user login */
router.post('/login', (req,res,next) => {
    User.findOne({Email: req.body.email}, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(401).json({
                message: 'Login failed'
            });
        }

        bcrypt.compare(req.body.password, user.Password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const jwtPayload = {
                    email: user.Email,
                    username: user.Username,
                    id: user._id
                };

                jwt.sign(
                    jwtPayload,
                    process.env.SECRET,
                    {
                        expiresIn: '2592000' // 1 month 30 days in seconds
                    },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                )
            } else {
                return res.status(401).json({
                    message: 'Login failed'
                });
            }
        });
    });
});


/* GET username with id */
router.get('/username/:id', (req,res,next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }
        res.json({
            Username: user.Username
        });
    });
});

/* POST check if user is logged in */
router.post('/check', checkAuth, (req,res,next) => {
    res.json({
        valid: true
    });
});

module.exports = router;
