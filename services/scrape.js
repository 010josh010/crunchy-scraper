const request = require('request'); 
//scrapes the crunchyroll news page 
const scraper = function (){
	return new Promise((res, rej)=>{
		const queryUrl = 'http://www.crunchyroll.com/news'; 

		request(queryUrl, (err, response, html) => {
			  if (!err && response.statusCode == 200) {
			   		res(html); 
			  }else{
			  	rej(err); 
			  }
		});
	})
}

module.exports = scraper; 











