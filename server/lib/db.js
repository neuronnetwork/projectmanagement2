'use strict';

var Q = require("q");
var mysql = require('mysql');
var config = require('../config');
var util = require('util');


module.exports = function() {
	
	var getUniqueId = function(table, db) {
		var deferred = Q.defer();
		console.log('in getUniqueId');	
		var sql = 'INSERT INTO `' + tableUniqueIds + '` (`tablename`) VALUES  (\"' + table + '\") ';
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};	 
 
	var getDbConnection = function() {
		console.log('getDBConnectionHelper');
		var deferred = Q.defer();
	    var connection;
 
		var connection = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : true
		});

	  	connection.connect(); 
	  	console.log('cpmmection: ' + util.inspect(connection));	
	  	if (connection.threadId > 0) {
	  		deferred.resolve(connection);
	  	} else {
 			console.log('error establishing connection ');
        	deferred.reject('DB connection error');
		}; 
	  	return deferred.promise;
	}; 
	 
//	var getDbConnection = function() {
//		var deferred = Q.defer();
//		console.log('in getDbConnection');	
//		
//		var connection = mysql.createConnection({
//			host : config.databaseMonitor.host,
//			user : config.databaseMonitor.username,
//			password : config.databaseMonitor.password,
//			database : config.databaseMonitor.database,
//			debug : true
//		});
//		var connection = mysql.createConnection({
//			host : 'localhost',
//			user : 'pm',
//			password : 'pm',
//			database : 'pm',
//			debug : false
//		});
//		console.log('in getDbConnection  -calling connection.cinnect');	
//
//		var a = connection.connect(function(err) { 
//			if (err) {
//				//logError('DB', 'could not connect to db server', err.stack);
//				console.log('getDbConnection ERROR: ', err.stack);
// 				console.log(err.code); // 'ECONNREFUSED'
//				console.log(err.fatal); // true 
// 			} 
//		});
//		
//		console.log('a ' + a)
//		deferred.resolve(connection);
//		console.log('in getDbConnection  -success');	
//		console.log('in getDbConnection  -deferred' + deferred);	
//		console.log('in getDbConnection  -deferred' + util.inspect(deferred.promise));	
//
//		return deferred.promise;
//		
//	};	
	
	var closeDbConnection = function(connection) {
		var deferred = Q.defer();
		console.log('in getDbConnection');	
		 
		connection.end(function(err) {
			if (err) {
				logError('DB', 'could not close connection to db server', err.stack);
				deferred.reject('error closing connection: ' + err.stack);
				
					
			} else {
				logDebug('DB', 'connection to DB server successfully closed');
				deferred.resolve(true);
			}
		});
		
		return deferred.promise;
	};	
	
    return {
    	getUniqueId			: getUniqueId,
    	getDbConnection		: getDbConnection,
    	closeDbConnection	: closeDbConnection
    };    
}(); 