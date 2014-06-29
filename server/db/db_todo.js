// database functions for todos
// insert a new todo, delete a todo, update a todo, add a comment etc ...

'use strict';


exports.dbTodo = function() {
 
	var updateTodo = function(todo, db) {
		var deferred = Q.defer();
		console.log('in updateTodo');

		var ts = new Date().getTime();
		var sql = 'UPDATE  `' + tableTodos + '` SET ';
		sql += 'todo = \"' + mysql_real_escape_string(todo.todo) + '\",';
		sql += 'start = \"' + mysql_real_escape_string(todo.start) + '\",';
		if (todo.end != 0) {
			sql += 'end = \"' + mysql_real_escape_string(todo.end) + '\",';
		}
		sql += 'type = \"' + mysql_real_escape_string(todo.type.type) + '\" ';
		sql += ' WHERE uid = ' + todo.uid;

		console.log('updateTodo: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	var updateTodoComment = function(todo, db) {
		var deferred = Q.defer();
		console.log('in updateTodoComment');
	
		var ts = new Date().getTime();
		var sql = 'UPDATE  `' + tableTodos + '` SET ';
		sql += 'comment = \"' + mysql_real_escape_string(todo.comment) + '\" ';
		sql += ' WHERE uid = ' + todo.uid;
	
		console.log('updateTodoComment: sql' + sql);
	
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	var updateTaskStatus = function(task_uid, status, db) {
		var deferred = Q.defer();
		console.log('in updateTaskComment');

		var ts = new Date().getTime();
		var sql = 'UPDATE  `' + tableTasks + '` SET ';
		sql += 'status = \"' + mysql_real_escape_string(status) + '\" ';
		sql += ' WHERE uid = ' + task_uid;

		console.log('updateTaskComment: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	var insertTask = function(uid, task, project_uid, user_uid, type, status, db) {
		var deferred = Q.defer();
		console.log('in insertTask');

		var ts = new Date().getTime();
		var sql = 'INSERT INTO `' + tableTasks  + '`   (uid, project_uid, task, user_uid, deleted, created, type, status) VALUES ';
		sql += '(' + uid + ',' + project_uid + ', \"' + mysql_real_escape_string(task) + '\",' + user_uid + ', false, ' + ts;
		sql += ', \"' + mysql_real_escape_string(type) + '\", \"' + mysql_real_escape_string(status) + '\")';
		console.log('insertTask: sql' + sql);

		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
	
	var getAllTasks = function(db) {
		var deferred = Q.defer();
		console.log('in getAllTasks');
		
		var sql = 'SELECT ' + tableTasks + '.*,  ' + tableUser + '.firstname FROM `tasks`';
		sql += 'LEFT JOIN `' + tableUser + '` ON ' + tableTasks + '.user_uid = ' + tableUser + '.id ';
		sql += 'WHERE ' + tableTasks + '.deleted = false'
		console.log('getAllTasks: sql' + sql);
		db.query(sql, deferred.makeNodeResolver());
		return deferred.promise;
	};
};
