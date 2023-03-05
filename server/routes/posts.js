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
    let returnedPosts = []; // This will be the array of posts that we will return
    for (let i = 0; i < posts.length; i++) {
        
        // Found help here: https://stackoverflow.com/questions/71816699/mongodb-findone-returns-object-with-undefined-property
        const user = await User.findById({_id: posts[i].CreatorId});
        // As we can see, we wont be returning the comments, as we do not want to display them on the home page
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
// Get username from the jwt token and use it to get the user id 
router.post('/', checkAuth, (req,res,next) => {
    // If title is bigger than 100 characters or content is bigger than 100 000 characters, return an error
    if (req.body.title.length > 100 || req.body.content.length > 100000) {
        return res.status(400).json({
            message: 'Title or content is too long'
        });
    }

    // Another way to do this is checking the json web token and getting the username from it, then finding the user with that username and getting the id from the user, but both ways are fine so i sticked with this one which is more straightforward
    User.findOne({Username: req.body.username}, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(401).json({
            message: 'User not found'
        });

        Post.create({
            CreatorId: user._id ,
            Title: req.body.title,
            Content: req.body.content,
            Comments: [], // This is an array of comment ids so we can bind them to the post
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
// The post id should be provided in the request body
router.post('/comment', checkAuth, (req,res,next) => {
    // If it has more than 100 000 
    if (req.body.content.length > 100000) return res.status(400).json({
        message: 'Comment is too long'
    });
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
                PostId: post._id, // Important so we can navigate from the comment to the post, it is used for example in the profile of the user
                Comment: req.body.content,
                DateCreated: Date.now()
            }, (err, comment) => {
                if (err) throw err;
                console.log(comment);
                console.log(comment._id)
                // Now we add the comment to the post and the user
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
// The post id should be provided in the request params
router.get('/:post_id', (req,res,next) => {
    Post.findOne({_id: req.params.post_id}, async (err, post) => {
        if (err) throw err;
        if (!post) return res.status(401).json({
            message: 'Post not found'
        });

        // Now we get the username of the creator of the post
        let user = await User.findOne({_id: post.CreatorId});
        post.CreatorUsername = user.Username;

        // Notice how we are creating a new object to return, this is because we do not want to return the comments array that is stored in the database as it contains the comment ids not the comments themselves, we will fetch the comments later on
        let returnedPost = {
            _id: post._id,
            CreatorUsername: user.Username,
            Title: post.Title,
            Content: post.Content,
            DateCreated: post.DateCreated,
            Votes: post.Votes

        }


        // Now we get the actual comments of the post with the content and the username of the creator
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

module.exports = router;