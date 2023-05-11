/*
    SETUP for a simple webapp
*/
// Express
var fs      = require('fs')
var express = require('express');   // We are using the express library for the web server
var exphbs  = require('express-handlebars');
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = process.env.PORT || 7518;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./db-connector')
//Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
/*
    ROUTES
*/
app.get('/', function(req, res)
    {
       res.status(200).render('mainPage')
});

app.get('*', function (req, res) {
	res.status(404).render('404');
});

app.listen(PORT, function (err) {
	if(err) throw err;
	console.log('== Server is listening on port', PORT);
});