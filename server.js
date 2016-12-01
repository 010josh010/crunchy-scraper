const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 
const mongoose = require('mongoose'); 
const cheerio = require('cheerio'); 
const scraper = require('./services/scrape.js'); 
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');


//express init and port 
const app = express(); 
const PORT = 9001;  

//middleware 
//for body parser 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.text()); 
app.use(bodyParser.json({type:'application/vnd.api+json'})); 

//method override 
app.use(methodOverride('_method'));

//for handlebars 
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//for serving static content 
app.use(express.static(path.join(__dirname, 'public')));

//export routes from router 

const mainController = require('./controllers/mainController.js'); 
app.use('/' , mainController); 


//listening for connections 
app.listen(PORT , _=> console.log('listening on port' , PORT)); 


let scrape = scraper().then(function(s){console.log(s)}); 



