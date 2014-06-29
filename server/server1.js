'use strict';

var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
// var methodOverride = require('method-override');
var app            = express();

//var http = require("http");
// var app = express();
// var reqLogger = require('express-request-logger');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//var mysql = require('mysql');
//var Q = require("q");
 var util = require('util');

//var path = require('path')

// our project includes
var config = require('./config');
 

// import utils which are needed by a lot of the routes
 var utils = require('./lib/utils');


// include routes
//var routesHtml = require('./routes/html_files');
//var routesProject = require('./routes/project');
//var routesTodo = require('./routes/todo');
//var routesUser = require('./routes/user');
//var routesLoginLogout = require('./routes/loginlogout');
//var routesFile = require('./routes/file');

//routesHtml.addRoutes(app, config);
//routesProject.addRoutes(app, config, utils);
//routesTodo.addRoutes(app, config, utils);
//routesUser.addRoutes(app, config, utils);
//routesLoginLogout.addRoutes(app, config, utils, passport);
//routesFile.addRoutes(app, config, utils);


app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

//persistent login sessions (recommended).

//app.use(passport.initialize());
//app.use(passport.session());
//app.use(express.static(config.directories.clientDir));


// var dbLoginLogout = require('./db/db_loginlogout');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
//passport.serializeUser(function(user, done) {
//	console.log('passport.serializeUser. user: ' + JSON.stringify(user));
//	done(null, user.id);
//});
//
//passport.deserializeUser(function(id, done) { 
//	console.log('passport.deserializeUser. id: ' +id);
//	dbLoginLogout.findById(id, function(err, user) {
//		done(err, user);
//	});
//});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
//passport.use(new LocalStrategy(function(username, password, done) {
//	console.log('passport.use:   username: ' + username);
//	console.log('passport.use:   password: ' + password);
//	// 	asynchronous verification, for effect...
//	process.nextTick(function() {
//		// 	Find the user by username.  If there is no user with the given
//		// username, or the password is not correct, set the user to `false` to
//		// 	indicate failure and set a flash message.  Otherwise, return the
//		// authenticated `user`.
//		dbLoginLogout.findByUsername(username, function(err, user) {
//			if (err) {
//				return done(err);
//			}
//			if (!user) {
//				return done(null, false, {
//					message : 'Unknown user ' + username
//				});
//			}
//			if (user.password != password) {
//				return done(null, false, {
//					message : 'Invalid password'
//				});
//			}
//			return done(null, user);
//		})
//	});
//}));

app.get('/loggedin', function(req, res) {
	console.log('GET /loggedin:   ' );
	
	if (process.env.NODE_ENV === 'development') {
		var user = {};
		user.username = "dev";
		user.password = "dev";
		user.id = 43;
		
		utils.debugLog('route - get("/loggedin")', 'dev environment -> sending dev user to the client'); 
		res.send(user);
	} else {
		utils.debugLog('route - get("/loggedin")', 'sending user: ' + JSON.stringify(user)); 
		res.send(req.isAuthenticated() ? req.user : '0');
	}
});

//             passport.authenticate('local'), 

app.post('/login',    function(req, res) {
	console.log('POST /login');
	console.log('POST /login: req.body: ' + util.inspect(req.body));
	
	utils.debugLog('route - post("/login")', 'sending user: ' + JSON.stringify(req.user)); 
	res.send(req.user);
});


//app.post('/login', function(req, res) {
//	console.log('post login');
//	res.send(200, 'ok');
//});

app.get('/logout', function(req, res) {
	utils.debugLog('route - get("/logout")', 'loggin out user: ' + JSON.stringify(req.user)); 
//	req.logout();
	res.send(200);
});

//console.log('passport: ' + passport); 
//console.log('passport: ' +  util.inspect(passport)); 
app.listen(config.server.listenPort);