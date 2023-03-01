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
const Posts = require('../models/Post');
const Comments = require('../models/Comment');

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
        User.findOne({Username:req.body.username}, (err, user) => {
            if (err) throw err;
            if (user) {
                return res.status(403).json({
                    message: 'Username already exists'
                });
            }
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

/* GET user profile, returns user object with posts, comments, name, date created and bio (not implemented yet) */
router.get('/profile/:username', (req,res,next) => {
    User.findOne({
        Username: req.params.username // change this to get it from body instead of params
    }, async (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        let posts = await Posts.find({
            CreatorId: user._id
        });
        let comments = await Comments.find({
            CreatorId: user._id
        });


        res.json({
            Username: user.Username,
            Posts: posts,
            Comments: comments,
            DateCreated: user.DateCreated,
            Bio: user.Bio
        });
    });
});

/* POST check if user is logged in */
router.post('/check', checkAuth, (req,res,next) => {
    res.json({
        valid: true
    });
});

/* POST update user bio */
router.post('/update/bio', checkAuth, (req,res,next) => {
    console.log(req.body);

    // Do not use findOneAndUpdate as it changes the date of the user
    User.findOne({
        Username: req.body.username
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        user.Bio = req.body.bio;
        user.save((err, user) => {
            if (err) throw err;
            res.json({
                success: true
            });
        });
    });
    /*


    User.findOneAndUpdate({
        Username: req.body.username
    }, {
        Bio: req.body.bio
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        res.json({
            success: true
        });
    });*/
});


module.exports = router;
