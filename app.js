// ******************************************
// Basic express application boilerplate.
// __________________________________________

// Add neccessary modules.
var express       = require('express');
var path          = require('path');
var port          = 3333;

var morgan        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');

// Set up the express application.
var app           = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use jade as template engine.
app.set('view engine', 'jade');

// Pass app to routes.
require('./app/routes/route.js')(app);

// Launch the app.
app.listen(port);
