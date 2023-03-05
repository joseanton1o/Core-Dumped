const mongoose=require('mongoose');
const Schema=mongoose.Schema;
let PostSchema=new Schema({
    CreatorId:{type:Object,required:true},//this is the id of the user who created the post to bind it to the user so we can display the username
    Title:{type:String,required:true,max:100},//the title of the post
    Content:{type:String,required:true,max:100000},//the content of the post
    Comments:{type:Array,required:true},//required:true, initialized to empty array, this is an array of comment ids to bind to the post, we will have other collections for comments
    Votes:{type:Number,required:true,default:0},//required:true, initialized to 0, this is the number of votes for the post, can be negative
    DateCreated:{type:Date,required:true,default:Date.now}
});

// Export the model
module.exports=mongoose.model('Post',PostSchema);