 'use strict'; 
//dependencies
const cheerio = require('cheerio'); 

//wrapped cheerio loader 
const Parser = (html)=>{
    return new Promise((res,rej)=>{
        const $ = cheerio.load(html);
        //new array to store each result from parsing
        let news = {
            items:[]
        }; 
        //iterates over each element with a news item class and extracts meaningful data
        $('.news-item').each(function(i, element) {
            try {
                //new empty result object 
                let result = {};
                //sets the properties of the new results object equal the the html attributes and values
                result.title = $(this).children('h2').children('a').text();
                result.description = $(this).children('h3').children('a').text(); 
                result.img = $(this).children('.body,clearfix').children('img').attr('src');
                result.author= $(this).children('.news-header2').children('.byline-and-post-date').children('.byline').children('a').text();  
                result.postDate= $(this).children('.news-header2').children('.byline-and-post-date').children('.post-date').text(); 
                result.link = $(this).children('h2').children('a').attr('href');  
                result.body = $(this).children('.body,clearfix').children('.short').children('p').text(); 
 
                //checking integrity of the result
                if(result.title 
                    && result.body
                        && result.link){
                    //adds the result to the news array 
                    news.items.push(result)
                } else {
                    throw "The result does not contain the data specified."; 
                } 
            } catch(err){
                console.error(err); 
            }
        }); 
        //if the news items Array contains an element then it will resolve the promise and return the array
        if(news.items[0]){
            res(news);
        }else{
            rej(err); 
        }
    }); 
}; 


//exported object
module.exports = Parser ; 