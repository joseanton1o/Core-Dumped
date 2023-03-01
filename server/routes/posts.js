var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const checkAuth = require('../middleware/check-auth');

/* GET all posts. 
    This will be the only route to get all posts, as we do not want to display comments on the home page there is no need to get all posts with comments.
    Only show the title, content, creator username, and date created as a preview for the home page.
*/
router.get('/', async function(req, res, next) {
    let posts = await Post.find({});
    let returnedPosts = [];
    for (let i = 0; i < posts.length; i++) {
        
        // Found here: https://stackoverflow.com/questions/71816699/mongodb-findone-returns-object-with-undefined-property
        const user = await User.findById({_id: posts[i].CreatorId});
        returnedPosts.push({
            _id: posts[i]._id, // so we can fetch later on when we click on the post to view it with all the comments
            CreatorUsername: user.Username,
            Title: posts[i].Title,
            Content: posts[i].Content,
            Votes: posts[i].Votes,
            DateCreated: posts[i].DateCreated
        });
    }
    return res.json(returnedPosts);
});

/* POST create a post */
// TODO: Add checkAuth middleware to this route, so only logged in users can create posts
// Get username from the jwt token and use it to get the user id 
router.post('/', checkAuth, (req,res,next) => {
    // This is a temporary solution, we will maybe use the jwt token to get the user id
    User.findOne({Username: req.body.username}, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(401).json({
            message: 'User not found'
        });

        Post.create({
            CreatorId: user._id ,
            Title: req.body.title,
            Content: req.body.content,
            Comments: [],
            DateCreated: Date.now()
        }, (err, post) => {
            if (err) throw err;
            user.Posts.push(post._id);
            console.log(post);
            return res.json({
                message: 'Post created',
                id: post._id.toString()
            });
        });
        
    });
});

/* POST create a comment in a post */
router.post('/comment', checkAuth, (req,res,next) => {
    // To use this route you need to send the post id and the comment content in the request body, also the username of the user who created the comment (temporary solution)
    Post.findOne({_id: req.body.postId}, (err, post) => {
        console.log("Arrives here");
        if (err) throw err;
        if (!post) return res.status(401).json({
            message: 'Post not found'
        });
        console.log("Arrives here");
        // Now we find the user who created the comment
        User.findOne({Username: req.body.username}, (err, user) => {
            if (err) throw err;
            if (!user) return res.status(401).json({
                message: 'User not found'
            });

            // Now we create the comment and add it to the post
            Comment.create({
                CreatorId: user._id,
                PostId: post._id,
                Comment: req.body.content,
                DateCreated: Date.now()
            }, (err, comment) => {
                if (err) throw err;
                console.log(comment);
                console.log(comment._id)
                
                post.Comments.push(comment._id);
                user.Comments.push(comment._id);
                
                    post.save();
                res.json({
                    message: 'Comment created'
                });
            });
        });
    });
});

/* GET a post with comments */
router.get('/:post_id', (req,res,next) => {
    Post.findOne({_id: req.params.post_id}, async (err, post) => {
        if (err) throw err;
        if (!post) return res.status(401).json({
            message: 'Post not found'
        });

        // Now we get the username of the creator of the post
        let user = await User.findOne({_id: post.CreatorId});
        post.CreatorUsername = user.Username;
        let returnedPost = {
            _id: post._id,
            CreatorUsername: user.Username,
            Title: post.Title,
            Content: post.Content,
            DateCreated: post.DateCreated,
            Votes: post.Votes

        }


        // Now we get the comments of the post
        let comments = await Comment.find({_id: {$in: post.Comments}});
        let returnedComments = [];
        // Now we get the username of the creator of each comment
        for (let i = 0; i < comments.length; i++) {
            let commentUser = await User.findOne({_id: comments[i].CreatorId});
            returnedComments.push({
                _id: comments[i]._id,
                CreatorUsername: commentUser.Username,
                Comment: comments[i].Comment,
                DateCreated: comments[i].DateCreated,
                Votes: comments[i].Votes
            });
        }

        returnedPost.Comments = returnedComments;
        res.json(returnedPost);
    });

});

/* GET a post from a comment id */

module.exports = router;