'use strict';

// express specific
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var app            = express();


// passport: user authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
 
 
var util = require('util');

// our project includes
var config = require('./config');

// import utils which are needed by a lot of the routes
 var utils = require('./lib/utils');

// log every request to the console
app.use(morgan('dev')); 					
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// authentication via passport
app.use(passport.initialize());
app.use(passport.session());

// static files
app.use(express.static('../client'));
 
// routes
var routesHtml = require('./routes/html_files');
routesHtml.addRoutes(app, config);


var userloginlogout = require('./db/db_loginlogout');
 
passport.serializeUser(function(user, done) {
	console.log('passport.serializeUser. user: ' + JSON.stringify(user));
	done(null, user.id);
});

passport.deserializeUser(function(id, done) { 
	console.log('passport.deserializeUser. id: ' +id);
	dbLoginLogout.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	console.log('passport.use:   username: ' + username);
	console.log('passport.use:   password: ' + password);
	// 	asynchronous verification, for effect...
	process.nextTick(function() {
		// 	Find the user by username.  If there is no user with the given
		// username, or the password is not correct, set the user to `false` to
		// 	indicate failure and set a flash message.  Otherwise, return the
		// authenticated `user`.
 
		userloginlogout.findByUsername(username, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message : 'Unknown user ' + username
				});
			}
			if (user.password != password) {
				return done(null, false, {
					message : 'Invalid password'
				});
			}
			return done(null, user);
		})
	});
}));

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
		console.log('route - get("/loggedin")', 'sending user: ' + JSON.stringify(user)); 
		res.send(req.isAuthenticated() ? req.user : '0');
	}
});

//       

app.post('/login',  passport.authenticate('local'),   function(req, res) {
	console.log('POST /login');
	console.log('POST /login: req.body: ' + util.inspect(req.body));
	console.log('POST /login: req.body: ' + JSON.stringify(req.body)); 

	utils.debugLog('route - post("/login")', 'sending user: ' + JSON.stringify(req.user)); 
	res.send(req.user);
});

app.get('/logout', function(req, res) {
	utils.debugLog('route - get("/logout")', 'loggin out user: ' + JSON.stringify(req.user)); 
 	req.logout();
	res.send(200);
});

app.listen(config.server.listenPort);