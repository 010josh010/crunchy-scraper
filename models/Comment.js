'use strict'; 
//dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Article Schema definition 
const CommentSchema = new Schema({

   body:{
      type:String, 
      trim: true 
   }, 

   articleRef:{
      type:Schema.Types.ObjectId,
      trim:true, 
      required:true, 
      ref: 'Article' 
   },

   commentCreated:{
      type: Date, 
      default: Date.now() 
   }

});

// Create the "User" model with our UserSchema schema
const Comment= mongoose.model("Comment", CommentSchema);

// Export the User model, so it can be used in server.js with a require
module.exports = Comment;