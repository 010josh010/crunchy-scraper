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
const Comment = require('../models/Comment.js'); 

/*Database configuration with mongoose begin----------*/
const MONGODB_URI = 'mongodb://heroku_rq20k72c:lq7h15c1ius5rbq2457ldv5fm4@ds133368.mlab.com:33368/heroku_rq20k72c'; 
mongoose.connect(MONGODB_URI);
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

/*routes-*/ 
//main route to render the index handlebars template
router.get('/' , (req, res)=>{
	res.render('index'); 
}); 

//route to return all articles from the db
router.get('/articles' , (req, res)=>{
	Article.find()
				.sort({'postDate':-1})
					.populate('comments')
						.exec((err, articles)=>{
							if(err){
								res.send(err); 
							} else {
								res.json(articles); 
							}
						}); 
}); 
//route to return the last 50 articles in the db 
router.get('/latest' , (req, res)=>{
	Article.find()
				.sort({'postDate':-1})
					.limit(50)
						.populate('comments')
							.exec((err, articles)=>{
								if(err){
									res.send(err); 
								} else {
									res.json(articles); 
								}
							})
}); 
//route to scrape , parse, and insert information into the db 
router.get('/scrape', (req, res)=> {
	Scraper()
		.then((html)=>{
			Parser(html)
				.then((news)=>{
					//parser returns an array obj with an items aray that will be iterated over 
					news.items.forEach((item)=>{
						//creating a link variable for comparison purposes
						let link = item.link; 
						//query to the database to compare entries 
						Article.findOne({'link':link})
									.exec((err, article)=>{
										//if there is no article found then save it to the db
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

				}).catch((err)=>{
					res.send(err); 
				})

		})
	
});
//route to add a new comment 
router.post('/comment/add' , (req, res)=>{
	//creating a new comment from out Comment model with the req body 
	const newComment = new Comment(req.body); 

	newComment.save((err, saved)=>{
		if(err){
			//sends errors to the client
			res.send(err); 
		} else {
			// Find our Article and push the new comment id into the Articles comments array
		      Article.findOneAndUpdate({'_id':saved.articleRef}, { $push: { 'comments': saved._id } }, { new: true })
		      	.populate('comments')
			      	.exec((err, newdoc)=> {
				        if (err) {
				          res.send(err);
				        }
				        // Or send the newdoc to the client
				        else {
				          res.send(newdoc);
				        }
			      })
		}
	})

}); 
//route to remove a comment 
router.delete('/comment/delete' , (req, res)=>{
	//assigns req body values for querying 
	const articleRef = req.body.articleRef; 
	const commentId = req.body._id;
	//removes the comment based on its unique id
	Comment.remove({'_id':commentId})
		.exec((err, removed)=>{
			if(err){
				res.send(err)
			} else {
				//removes comment id reference from the Atricle's comments array
				Article.findOneAndUpdate({'_id':articleRef}, { $pull: { 'comments':commentId } }, { new: true })
		      		.populate('comments')
				      	.exec((err, newdoc)=> {
					        if (err) {
					          res.send(err);
					        }
					        // Or send the newdoc to the client
					        else {
					          res.send(newdoc);
					        }
				      })
			}
		})


});
//exports the module as router
module.exports = router ; 