var mysql = require('mysql');
var Q = require('q');
var util = require('util');


console.log('created connection');	

var getDbConnection = function() {
	var deferred = Q.defer();
	console.log('in getDbConnection');	
	
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'pm',
		password : 'pm',
		database : 'pm',
		debug : false
	});
	console.log('in getDbConnection  -calling connection.cinnect');	

	connection.connect(function(err) { 
		if (err) {
 			console.log('getDbConnection ERROR: ', err.stack);
			deferred.reject('error connecting: ' + err.stack);
		} else {
 			console.log('getDbConnection success');
			deferred.resolve(connection);
		}
		console.log('DB', 'connection to DB established with id ' + connection.threadId);
	});
	console.log('in getDbConnection  -return');	

	return deferred.promise;
};	

getDbConnection().then(function(connection) {
	console.log('success connectiong to db');
	console.log('connection:  ' + util.inspect(connection));
}); 

 