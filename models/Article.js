'use strict'; 
//dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Article Schema definition 
const ArticleSchema = new Schema({

   title:{
      type:String, 
      trim:true, 
      required:true
   }, 

   description:{
      type:String, 
      trim:true
   }, 

   img:{
      type:String, 
      trim:true 
   }, 

   author:{
      type:String, 
      trim:true
   }, 

   postDate:{
      type:String, 
      trim:true
   }, 

   link:{
      type:String,
      trim:true, 
      required:true
   },

   body:{
      type:String,
      trim:true,
      required:true
   }, 

   comments: [{
    // Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Comment model
    ref: 'Comment'
  }], 

   articleCreated:{
      type: Date, 
      default: Date.now() 
   }

});

//Schema methods 
ArticleSchema.methods.returnTitleAndDate = _=>{
   return this.headline + ' ' + articleCreated; 
}

// Create the "User" model with our UserSchema schema
const Article = mongoose.model("Article", ArticleSchema);

// Export the User model, so it can be used in server.js with a require
module.exports = Article;