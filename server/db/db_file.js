// database functions for (uploaded) files 

'use strict';

exports.dbFile = function(utils) {
	
	var getAllFiles = function(db) {
		var deferred = Q.defer();
		console.log('in getAllFiles');
		var sql = 'SELECT * FROM `' + tableFiles + '` WHERE deleted = false ';
		console.log('in getAllFiles: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};	
	
	var deleteFile = function(fileId, db) {
		var deferred = Q.defer();
		console.log('in deleteFile');

		var ts = new Date().getTime();
		var sql = 'DELETE FROM `' + tableFiles + '`  WHERE uid = ' + fileId;
		console.log('deleteFile: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	var insertFile = function(file_uid, filename, filelocation, filegroup_uid, user_uid, db) {
		var deferred = Q.defer();
		console.log('in insertFile');

		var ts = new Date().getTime();
		var sql = 'INSERT INTO `' + tableFiles + '`(uid, filename, filelocation, filegroup_uid, user_uid, deleted,  created) VALUES ';
		sql += '(' + file_uid + ', \"' + mysql_real_escape_string(filename)
				+ '\",\"' + mysql_real_escape_string(filelocation) + '\",';
		sql += filegroup_uid + ', ' + user_uid + ', false, ' + ts + ')';
		console.log('insertFile: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	

	var getFile = function(file_uid, db) {
		var deferred = Q.defer();

		var ts = new Date().getTime();
		var sql = 'SELECT * FROM  `' + tableFiles + '` WHERE uid = ' + file_uid;
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	
};
