const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    Username: {type: String, required: true, max: 100}, // The username is unique, so we will use it as some sort of unique key
    Password: {type: String, required: true, max: 100}, // Obviously, we will not store the password in plain text, we will use some sort of hashing algorithm
    Email: {type: String, required: true, max: 100}, // The email is unique, so we will use it as some sort of unique key
    Posts: {type: Array, required: true}, // required: true, initialized to empty array, this is an array of post ids to bind to the user, we will have other collections for posts
    Comments: {type: Array, required: true}, // required: true, initialized to empty array, this is an array of comment ids to bind to the user, we will have other collections for comments
    DateCreated: {type: Date, required: true, default: Date.now}
}); // For now, we will not have a profile picture, we will maybe add that later

// Export the model
module.exports = mongoose.model('User', UserSchema);