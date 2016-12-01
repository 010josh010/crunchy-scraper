const express = require('express'); 
const router = express.Router();
const scraper = require('../services/scrape.js'); 



router.get('/' , (req, res)=>{

	let scrape = scraper().then(function(html){
		res.send('<h1> Crunchy Scraper </h1>' + html)
	}); 
	
}); 


module.exports = router ; 