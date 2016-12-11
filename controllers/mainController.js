'use strict'; 
//dependencies
const express = require('express'); 
const router = express.Router();
const mongoose = require("mongoose");

//required service modules 
const Scraper = require('../services/Scraper.js');
const Parser = require('../services/Parser.js'); 

//models 
const Article = require('../models/Article.js'); 

/*Database configuration with mongoose begin----------*/
mongoose.connect('mongodb://localhost/crunchyNewsdb');
var db = mongoose.connection;
//configuring mongoose to use native promises due to mpromise deprecation
mongoose.promise = global.Promise; 

// Show any mongoose errors
db.on('error',(err)=>{
  console.log("Mongoose Error: ", err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open',_=> {
  console.log('Mongoose connection successful.');
});
/*end configuration------------------------------------*/ 

//routes 
router.get('/' , (req, res)=>{
	res.render('index'); 
}); 

//for testing ---------------------
router.get('/test' , (req, res)=>{

	let test2 = {
	title:'test article 2', 
	img: 'src', 
	link:'new link', 
	body:'some text'
}; 

let entry = new Article(test2); 

	entry.save((err, doc)=>{
		if(err){
			console.error(err)
		} else {
			console.log('document saved'); 
		}
	})

	Article.find({} , (err, doc)=>{
		if(err){
			console.error(err); 
		} else{
			console.log('document found!'); 
			entry.remove((err, removed)=>{
				if(err){
					console.error(err)
				} else {
					console.log('entry has been removed');
					res.json(doc);  
				}
			})
		}
	})
}); 

//end test --------------------------

router.get('/articles' , (req, res)=>{
	Article.find()
				.exec((err, articles)=>{
					if(err){
						res.send(err); 
					} else {
						res.json(articles); 
					}
				}); 
}); 

router.get('/latest' , (req, res)=>{
	Article.find()
				.sort({'articeCreated':-1})
					.limit(15)
						.exec((err, articles)=>{
							res.json(articles); 
						})
}); 

router.get('/scrape', (req, res)=> {
	Scraper()
		.then((html)=>{
			Parser(html)
				.then((news)=>{
					//parser returns an array obj with an items aray that will be iterated over 
					news.items.forEach((item)=>{
						//creating a link variable for comparison purposes
						let link = item.link; 
						//query to the database to compare entries and then save the entry if it is not found. 
						Article.findOne({'link':link})
									.exec((err, article)=>{
										if(!article){
											let entry = new Article(item); 
											entry.save((err, saved)=>{
												if(err){
													console.error(err)
												} else {
													console.log('SUCCESS: Insert complete Article {',saved.title,'} saved to the db.'); 
												}
											});
										} else {
											console.error('ERROR: Insert failed. Article {',article.title,'} already exists in the db. **'); 
										}
									});
						
					});
					res.send({msg:'scrape complete: db updated'});
				})

		})
	
}); 

module.exports = router ; 