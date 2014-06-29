// database functions for user management
// insert a new user, delete a user, update the profile etc.

'use strict';

exports.dbUser = function(app, config) {

	// update user profile
	var updateUser = function(user, db) {
		var deferred = Q.defer();

		var ts = new Date().getTime();
		var sql = 'UPDATE `' + tableUser + '` SET   ';
		sql += '   firstname =  \"' + mysql_real_escape_string(user.firstname) + '\",'
		sql += '   lastname = \"' + mysql_real_escape_string(user.lastname) + '\",'
		sql += '   username = \"' + mysql_real_escape_string(user.username) + '\",'
		sql += '   password = \"' + mysql_real_escape_string(user.password) + '\" '
		sql += ' WHERE  id = ' + user.id;

		console.log('updateUser: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	// insert new user into database
	var insertUser = function(userId, user, db) {
		var deferred = Q.defer();
		console.log('in insertUser');	

		var ts = new Date().getTime();
		var sql = 'INSERT INTO `' + tableUser
				+ '` (id, firstname, lastname, username, password, admin) VALUES ';
		sql += '(' + userId + ', ';
		sql += '\"' + mysql_real_escape_string(user.firstname) + '\",'
		sql += '\"' + mysql_real_escape_string(user.lastname) + '\",'
		sql += '\"' + mysql_real_escape_string(user.username) + '\",'
		sql += '\"' + mysql_real_escape_string(user.password) + '\",'
		sql += ' false)';

		console.log('insertUser: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	}; 
};
