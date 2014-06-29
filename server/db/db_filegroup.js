// database functions for projects 
// insert a new project, delete a project, update a project, add a document, a file, etc ...

'use strict';

exports.dbFilegroup = function() { 
 
	var getAllFileGroups = function(db) {
		var deferred = Q.defer();
		console.log('in getAllFileGroups');
		var sql = 'SELECT * FROM `' + tableFileGroups + '` WHERE deleted = false ';
		console.log('in getAllFileGroups: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	var insertFileGroup = function(filegroup_uid, description, task_uid, db) {
		var deferred = Q.defer();
		console.log('in insertFileGroup');

		var ts = new Date().getTime();
		var sql = 'INSERT INTO `' + tableFileGroups + '`  (uid, description, task_uid, deleted, created) VALUES ';
		sql += '(' + filegroup_uid + ', \"' + mysql_real_escape_string(description)
				+ '\",' + task_uid + ', false, ' + ts + ')';
		console.log('insertFileGroup: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	

	var deleteFileGroup = function(filegroupId, db) {
		var deferred = Q.defer();
		console.log('in deleteFileGroup');

		var ts = new Date().getTime();
		var sql = 'DELETE FROM `' + tableFileGroups + '`  WHERE uid = ' + filegroupId;
		console.log('deleteFileGroup: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
};