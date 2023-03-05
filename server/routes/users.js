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
/* This route is not protected, anyone can register 
    We will check if the email or username already exists, if not, then we will create the user
*/
router.post('/register', (req,res,next) => {
    // Check if the email and username have a length of more than 100 characters
    if (req.body.email.length > 100 || req.body.username.length > 100) {
        return res.status(400).json({ // bad request
            message: 'Email or username is too long'
        });
    }
    if (req.body.username === "NULL") {
        return res.status(400).json({ // bad request
            message: 'Username cannot be "NULL"'
        });
    }

    User.findOne({Email:req.body.email}, (err, user) => {
        if (err) throw err;
        if (user) { // If the user exists, then we will return an error
            return res.status(403).json({
                message: 'Email already exists'
            });
        }
        User.findOne({Username:req.body.username}, (err, user) => { // Check if the username already exists
            if (err) throw err;
            if (user) {
                return res.status(403).json({
                    message: 'Username already exists'
                });
            }
            /*
                genSalt() generates a random string of characters to be used as a salt to hash the password
            */
            bcrypt.genSalt(10, (err, salt) => { 
                if (err) throw err;
                bcrypt.hash(req.body.password, salt, (err, hash) => { // Hash the password using the salt generated
                    if (err) throw err; 
                    User.create({ // Create the user in the database
                        Username: req.body.username,
                        Password: hash,
                        Email: req.body.email,
                        Posts: [],
                        Comments: [],
                        DateCreated: Date.now()
                    }, (err, user) => { // We won't return the user object, just a message
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
/*
    This route is not protected, anyone can login
    We will check if the email exists, if it does, then we will compare the password
*/
router.post('/login', (req,res,next) => {
    User.findOne({Email: req.body.email}, (err, user) => { // Check if the email exists
        if (err) throw err;
        if (!user) {
            return res.status(401).json({ 
                message: 'Login failed' // If the email doesn't exist, then we will return an error
            });
        }

        bcrypt.compare(req.body.password, user.Password, (err, isMatch) => { // Compare the password with the hash stored in the database
            if (err) throw err;
            if (isMatch) { // If the password matches, then we will create a JWT token
                const jwtPayload = {
                    email: user.Email,
                    username: user.Username,
                    id: user._id
                };

                jwt.sign(
                    jwtPayload,
                    process.env.SECRET,
                    {
                        expiresIn: 2592000 // The token will expire in 1 month which is 2592000 seconds
                    },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            success: true,
                            token: 'Bearer ' + token // We will return a Bearer token to the user
                        });
                    }
                )
            } else {
                return res.status(401).json({
                    message: 'Login failed' // If the password doesn't match, then we will return an error
                });
            }
            // Notice that we are not returning an error if the email doesn't exist, this is to prevent possible attacks
        });
    });
});


/* GET username with id */
/* May be used in the frontend to get the username of the user with the id */
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

/* GET user profile, returns user object with posts, comments, name, date created and bio (if any) */
router.get('/profile/:username', (req,res,next) => {
    User.findOne({
        Username: req.params.username // Find the user with the username
    }, async (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        let posts = await Posts.find({
            CreatorId: user._id // Find all the posts with the user id
        });
        let comments = await Comments.find({
            CreatorId: user._id // Find all the comments with the user id
        });


        res.json({ // Return the user object with the posts, comments, name, date created and bio
            Username: user.Username,
            Posts: posts,
            Comments: comments,
            DateCreated: user.DateCreated,
            Bio: user.Bio
        });
    });
});

/* POST check if user is logged in */
/* This route is mainly used to check if the token is expired and if the token is valid */
router.post('/check', checkAuth, (req,res,next) => {
    res.json({
        valid: true
    });
});

/* POST update user bio */
/* We could use the PUT method, but I prefer to use POST  as the first time a user logs in, they will not have a bio and they will be posting a bio for the first time */
router.post('/update/bio', checkAuth, (req,res,next) => {
    console.log(req.body);
    // If bio is longer than 1000 characters, then we will return an error
    if (req.body.bio.length > 1000) {
        return res.status(403).json({
            message: 'Bio is too long'
        });
    }

    User.findOne({
        Username: req.body.username
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                error: 'User not found' // If the user doesn't exist, then we will return an error
            });
        }
        if (req.body.bio === '') { // If the bio is empty, then we will delete the bio
            user.Bio = undefined;
        } else {
            user.Bio = req.body.bio; // Update the bio
        }
        user.save((err, user) => { // Save the user object with the updated bio
            if (err) throw err;
            res.json({
                success: true
            });
        });
    });
});


module.exports = router;
