// database functions for projects 
// insert a new project, delete a project, update a project, add a document, a file, etc ...

'use strict';

exports.dbEtherpad = function() { 

	var insertEtherpad = function(uid, etherpadName, project_uid, user_uid, db) {
		var deferred = Q.defer();
		console.log('in insertEtherpads');
		console.log(' in insertEtherpads etherpadName: ' +  etherpadName);

		var ts = new Date().getTime();
		var sql = 'INSERT INTO `'
				+ tableEtherpads
				+ '`   (uid, project_uid, name, user_uid, deleted, created) VALUES ';
		sql += '(' + uid + ',' + project_uid + ', \"'
				+ mysql_real_escape_string(etherpadName) + '\",' + user_uid
				+ ', false, ' + ts + ')';
		console.log('insertEtherpads: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	}; 

	var getAllEtherpads = function(db) {
		var deferred = Q.defer();
		console.log('in getAllEtherpads');
		var sql = 'SELECT * FROM `' + tableEtherpads + '` WHERE deleted = false ';
		console.log('getAllEtherpads: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	}; 
	 
};