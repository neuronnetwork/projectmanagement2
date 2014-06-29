// database functions for user login logout 

'use strict';

var db = require('../lib/db');
var Q = require("q");
var config = require('../config');
var util = require('util');

module.exports = function() {
	
	console.log('db : ' + util.inspect(db));
	
	var getUserById = function(id, db) {
		console.log('getUserById   id: ' +id);
		var deferred = Q.defer();
		var sql;
		var sql = 'SELECT  * FROM `' + config.tables.user + '`  WHERE id = ' + id;
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};

	var getUserByUsername = function(username, db) {
		console.log('getUserByUsername   username: ' +username);
		var deferred = Q.defer();
		var sql;
		var sql = 'SELECT  * FROM `' + config.tables.user + '`  WHERE username = \"' + username + '\"';
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};

	var findById = function (id, fn) {
		console.log('findById   id: ' +id);
		var database = db.getDbConnection(); 
		getUserById(id, database).then(function(rows) {
			if (rows[0][0] != undefined) {
				var user = rows[0][0];
				console.log('"findById" - database:  ' + JSON.stringify(database)); 
				fn(null, user);
			} else {
				fn(new Error('User ' + id + ' does not exist'));
			}
		});
		
		// TODO: close connection
	}

	var findByUsername = function(username, fn) {
		console.log('findByUsername   username: ' +username);
		var database = db.getDbConnection(); 
		
		console.log('"findByUsername" - database: ' + util.inspect(database)); 

		getUserByUsername(username, database).then(function(rows) {
			if (rows[0][0] != undefined) {
				var user = rows[0][0];
				console.log('"findByUsername" - user: ' + JSON.stringify(user)); 
				return fn(null, user);
			}
			return fn(null, null);
		});
	}	 
	
	return {
		getUserById			: getUserById,
		getUserByUsername	: getUserByUsername,
		findById			: findById,
		findByUsername		: findByUsername
	};  
}(); 
