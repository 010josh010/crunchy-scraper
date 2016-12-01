const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 
const mongoose = require('mongoose'); 
const cheerio = require('cheerio'); 
const request = require('request'); 


//express init and port 
const app = express(); 
const PORT = 9001;  


//for body parser 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.text()); 
app.use(bodyParser.json({type:'application/vnd.api+json'})); 

//for serving static content 
app.use(express.static(path.join(__dirname, 'public')));


//listening for connections 
app.listen(PORT , _=> console.log('listening on port' , PORT)); 



