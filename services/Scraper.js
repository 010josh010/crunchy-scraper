'use strict'; 
//dependencies
const request = require('request'); 
//scrapes the crunchyroll news page 
const Scraper = function (){
	return new Promise((res, rej)=>{
		const queryUrl = 'http://www.crunchyroll.com/news'; 
		//http request from the server to return with scraped html
		request(queryUrl, (err, response, html) => {
			  if (!err && response.statusCode == 200) {
			   		res(html); 
			  }else{
			  		rej(err); 
			  }
		});
	})
}

//exported object
module.exports = Scraper; 










