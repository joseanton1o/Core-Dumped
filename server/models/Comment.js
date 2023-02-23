const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    CreatorId: {type: Object, required: true}, // this is the id of the user who created the comment to bind it to the user so we can display the username
    Comment: {type: String, required: true, max: 1000}, // the comment itself
    Votes:{type:Number,required:true,default:0},//required:true, initialized to 0, this is the number of votes for the post, can be negative
    DateCreated: {type: Date, required: true, default: Date.now}
    // There is no need to have a post id here, because we will have a comment collection for each post and we will use the comment id to bind it to the post
});

// Export the model
module.exports = mongoose.model('Comment', CommentSchema);