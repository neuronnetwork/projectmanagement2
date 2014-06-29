// REST routes for user management: add, delete, update etc

'use strict';

exports.addRoutes = function(app, config) {

	// get a list of all user
	app.get("/user", function(req, res) {
		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});
		var sql = 'SELECT * FROM  `' + tableUser + '` ORDER BY lastname';

		databaseMonitor.query(sql, function(err, rows, fields) {
			databaseMonitor.end();
			if (err) {
				utils.errorLog('route - get("/user")', 'ERROR: ' +err);  
				res.send(500, 'Query error in get "/user" !');
			} else {
				var json = {
					allUser : rows
				};
				utils.debugLog('route - get("/user")', 'got some users: ' +JSON.stringify(rows));  
				res.json(json);
			}
		});
	}); 
	
	// update a user profile
	app.post("/user", function(req, res) {
		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		var user = {
			firstname : req.body.firstname,
			lastname : req.body.lastname,
			password : req.body.password,
			username : req.body.username,
			id : req.body.id
		}
	 
		updateUser(user, databaseMonitor).then(function(result) {
			utils.debugLog('route - post("/user")', 'updateUser success ');  
			res.send(200, 'User erfolgreich upgedated');
		}).fail(function(err) {
			utils.errorLog('route - post("/user")', 'ERROR  updateUser. err: ' + err); 
			res.send(500, 'Query error in POST  /user !');
		}).done(function() {
			utils.debugLog('route - post("/user")', 'finished request'); 
			databaseMonitor.end();
		});
	});

	// insert a new user
	app.post("/newuser", function(req, res) {
		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		var user = {
			firstname : req.body.firstname,
			lastname : req.body.lastname,
			password : req.body.password,
			username : req.body.username
		}

		getUniqueId(tableUser, databaseMonitor).then(function(result) {
			var userId = result[0].insertId; // result of promise1
			utils.debugLog('route - post("/newuser")', 'app.post("/newuser")  userId: ' + userId);

			insertUser(userId, user, databaseMonitor).then(function() {
				var json = {
					userId : userId,
				}
				utils.debugLog('route - post("/newuser")', 'app.post("/newuser")  success: ');
				res.json(json);
			}).fail(function(err) {
				utils.errorLog('route - post("/newuser")', 'ERROR: ' + err); 
				res.send(500, 'Query error in POST  /newuser !');
			}).done(function() {
				utils.debugLog('route - post("/newuser")', '"insertUser" finished'); 
			});
		}).fail(function(err) {
			utils.errorLog('route - post("/newuser")', 'ERROR  getUniqueId in  POST  /newuser err: ' + err); 
			res.send(500, 'Query error in POST  /newuser !');
		}).done(function() {
			utils.debugLog('route - post("/newuser")', 'finished request'); 
			databaseMonitor.end();
		});
	});
};