// database functions for (uploaded) files 

'use strict';

exports.dbLink = function(utils) {
	
	var getAllLinks = function(db) {
		var deferred = Q.defer();
		console.log('in getAllLinks');
		var sql = 'SELECT * FROM `' + tableLinks + '` WHERE deleted = false ';
		console.log('in getAllLinks: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	}; 
	
	var insertLink = function(link_uid, url, linkname, task_uid, db) {
		var deferred = Q.defer();
		console.log('in insertLink');

		var ts = new Date().getTime();
		var sql = 'INSERT INTO `' + tableLinks + '`   (uid, url, linkname, task_uid, deleted,  created) VALUES ';
		sql += '(' + link_uid + ', \"' + mysql_real_escape_string(url) + '\",\"'
				+ mysql_real_escape_string(linkname) + '\",';
		sql += task_uid + ', false, ' + ts + ')';
		console.log('insertLink: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	var deleteLink = function(linkId, db) {
		var deferred = Q.defer();
		console.log('in deleteLink');

		var ts = new Date().getTime();
		var sql = 'DELETE FROM `' + tableLinks + '`  WHERE uid = ' + linkId;
		console.log('deleteLink: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
};
