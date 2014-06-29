// database functions for projects 
// insert a new project, delete a project, update a project, add a document, a file, etc ...

'use strict';

exports.dbProject = function(utils) {
	
	var insertNewProject = function(uid, projecttitle, user_uid, db) {
		var deferred = Q.defer();
		console.log('in "insertNewProject"');	
		console.log('in insertNewProject projecttitle: ' +  projecttitle);
	
		var ts = new Date().getTime();
		var sql = 'INSERT INTO `' + tableProjects + '` (uid, project_title, user_uid, deleted, created) VALUES ';
		sql += '(' + uid + ', \"' + utils.mysql_real_escape_string(projecttitle) + '\",' + user_uid + ', false, ' + ts + ')';
		console.log('insertNewProject: sql' + sql);
	
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	// add a file to a specific project
	var insertFileForProject = function(file_uid, filename, filelocation, project_uid, user_uid, db) {
		var deferred = Q.defer();
		console.log('in insertFile');

		var ts = new Date().getTime();
		var sql = 'INSERT INTO `' + tableFiles + '`   (uid, filename, filelocation, project_uid, user_uid, deleted,  created) VALUES ';
		sql += '(' + file_uid + ', \"' + mysql_real_escape_string(filename)	+ '\",\"' + mysql_real_escape_string(filelocation) + '\",';
		sql += project_uid + ', ' + user_uid + ', false, ' + ts + ')';
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	

	var getAllProjects = function(db) {
		var deferred = Q.defer();
		console.log('in getAllProjects');
		var sql = 'SELECT * FROM `' + tableProjects + '` WHERE deleted = false ';
		console.log('getAllProjects: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	 
};