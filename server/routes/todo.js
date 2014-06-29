// REST routes for todo management: add, delete, update etc

'use strict';

exports.addRoutes = function(app, config, utils) {
 
	app.put("/todo/data", utils.auth, function(req, res) {
		utils.debugLog('route - put("/todo/data")', "matching request function PUT  '/todo/data'");
		utils.debugLog('route - put("/todo/data")', 'req.body.todo: ' + JSON.stringify(req.body.todo));

		var todo = req.body.todo;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});
		
		updateTodo(todo, databaseMonitor).then(function() {
			var json = {
				msg : 'Update tododata erfolgreich'
			}
			utils.debugLog('route - put("/todo/data")', 'app.put("/todo/data")  success: ');
			res.json(json);
		}).fail(function(err) {
			utils.errorLog('route - put("/todo/data")', 'insertTodo ERROR in  PUT  /todo/data err: ' + err); 
			res.send(500, 'Query error in POST  /todo/data !');
		}).done(function() {
			utils.debugLog('route - put("/todo/data")', 'ende in  PUT  /todo/data: '); 
			databaseMonitor.end();
		});
	});
	

	app.put("/todo/comment", utils.auth, function(req, res) {
		utils.debugLog('route - put("/todo/comment")', "matching request function PUT  '/todo/comment'");
		utils.debugLog('route - put("/todo/comment")', 'req.body.todo: ' + JSON.stringify(req.body.todo)); 	
		utils.debugLog('route - put("/todo/comment")', 'req.params.id: ' + req.params.id);

		var todo = req.body.todo;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});
		updateTodoComment(todo, databaseMonitor).then(function() {
			var json = {
				msg : 'Update /todo/comment/ erfolgreich'
			}
			utils.debugLog('route - put("/todo/comment")', 'app.put("/todo/comment")  success: ');
			res.json(json);
		}).fail(function(err) {
			utils.errorLog('route - put("/todo/comment")', 'insertTodo ERROR in  PUT  /todo/comment err: ' + err); 
			res.send(500, 'Query error in POST  /todo/comment !');
		}).done(function() {
			utils.debugLog('route - put("/todo/comment")', 'ende in  PUT  /todo/comment: '); 
			databaseMonitor.end();
		});
	});
	
	
	app.put("/todo/status", utils.auth, function(req, res) {
		utils.debugLog('route - put("/todo/status")', "matching request function PUT  '/todo/status'");
		utils.debugLog('route - put("/todo/status")', 'req.body.status: ' + JSON.stringify(req.body.status));
		utils.debugLog('route - put("/todo/status")', 'req.body.todo_uid: ' + JSON.stringify(req.body.todo_uid));

		var status = req.body.status;
		var todo_uid = req.body.todo_uid;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});
		updateTodoStatus(todo_uid, status, databaseMonitor).then(function() {
			var json = {
				msg : 'Update /todo/status/ erfolgreich'
			}
			utils.debugLog('route - put("/todo/status")', 'app.put("/todo/status")  success: ');
			res.json(json);
		}).fail(function(err) {
			utils.errorLog('route - put("/todo/status")', 'insertTodo ERROR in  PUT  /todo/status err: ' + err); 
			res.send(500, 'Query error in POST  /todo/status !');
		}).done(function() {
			utils.debugLog('route - put("/todo/status")', 'ende in  PUT  /todo/status: '); 
			databaseMonitor.end();
		});
	});
	
	app.post("/newtodo", utils.auth, function(req, res) {
		utils.debugLog('route - put("/newtodo")', "matching request function POST  '/newtodo'");
		utils.debugLog('route - put("/newtodo")', 'req.body.todo: ' + req.body.todo);
		utils.debugLog('route - put("/newtodo")', 'req.body.project_uid: ' + req.body.project_uid);
		utils.debugLog('route - put("/newtodo")', 'req.body.user_uid: ' + req.body.user_uid);

		var todo = req.body.todo;
		var project_uid = req.body.project_uid;
		var user_uid = req.body.user_uid;
		var type = req.body.type;
		var status = req.body.status;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		// get 1 new id  for the Todos 

		getUniqueId(tableTodos, databaseMonitor).then(function(result) {
			var todo_uid = result[0].insertId; // result of promise1
			utils.debugLog('route - put("/newtodo")', 'app.post("/newtodo")  todo_uid: ' + todo_uid);

			insertTodo(todo_uid, todo, project_uid, user_uid, type, status, databaseMonitor).then(function() {
				var json = {
					uid : todo_uid,
					todo : todo
				}
				utils.debugLog('route - put("/newtodo")', 'app.post("/newtodo")  success: ');
				res.json(json);
			}).fail(function(err) {
				utils.errorLog('route - put("/newtodo")', 'insertTodo ERROR in  POST  /newtodo err: ' + err); 
				res.send(500, 'Query error in POST  /newtodo !');
			}).done(function() {
				utils.debugLog('route - put("/newtodo")', 'insertTodo alles gut in  POST  /newtodo: '); 
				// databaseMonitor.end();
			});
		}).fail(function(err) {
			utils.errorLog('route - put("/newtodo")', 'ERROR  getUniqueId in  POST  /newtodo err: ' + err); 
			res.send(500, 'Query error in POST  /newtodo !');
		}).done(function() {
			utils.debugLog('route - put("/newtodo")', 'alles gut in  POST  /newtodo: '); 
			databaseMonitor.end();
		});
	});

	app.post("/todo/newfilegroup", utils.auth, function(req, res) {
		utils.debugLog('route - post("/todo/newfilegroup")', "matching request function POST  '/todo/newfilegroup'");
		utils.debugLog('route - post("/todo/newfilegroup")', 'req.body.description: ' + req.body.description);
		utils.debugLog('route - post("/todo/newfilegroup")', 'req.body.todo_uid: ' + req.body.todo_uid);
		utils.debugLog('route - post("/todo/newfilegroup")', 'req.body.userId: ' + req.body.userId);

		var description = req.body.description;
		var todo_uid = req.body.todo_uid;
		//	var userId = req.body.userId;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		// get 1 new id  for the filegroup 

		getUniqueId(tableFileGroups, databaseMonitor).then(function(result) {
			var filegroup_uid = result[0].insertId; // result of promise1
			utils.debugLog('route - post("/todo/newfilegroup")', 'app.post("/todo/newfilegroup")  filegroup_uid: ' + filegroup_uid);

			insertFileGroup(filegroup_uid, description, todo_uid, databaseMonitor).then(function() {
				var json = {
					filegroupId : filegroup_uid,
					description : description
				}
				
				utils.debugLog('route - post("/todo/newfilegroup")', 'app.post("/todo/newfilegroup")  success: ');
				res.json(json);
			}).fail(function(err) {
				utils.errorLog('route - post("/todo/newfilegroup")', 'insertTodo ERROR in  POST  /todo/newfilegroup err: ' + err); 
				res.send(500, 'Query error in POST  /todo/newfilegroupv !');
			}).done(function() {
				utils.debugLog('route - post("/todo/newfilegroup")', 'insertTodo alles gut in  POST  /todo/newfilegroup: '); 
				// databaseMonitor.end();
			});
		}).fail(function(err) {
			utils.errorLog('route - post("/todo/newfilegroup")', 'ERROR  getUniqueId in  POST  /todo/newfilegroup err: ' + err); 
			res.send(500, 'Query error in POST  /todo/newfilegroup !');
		}).done(function() {
			utils.debugLog('route - post("/todo/newfilegroup")', 'alles gut in  POST  /todo/newfilegroup: '); 
			databaseMonitor.end();
		});
	});
	
	

	app.delete("/todo/filegroup/:id", utils.auth, function(req, res) {
		utils.debugLog('route - del("/todo/filegroup/:id")', "matching request function DELETE '/todo/filegroup/:id'");
		utils.debugLog('route - del("/todo/filegroup/:id")', 'req.params.id: ' + req.params.id);
		utils.debugLog('route - del("/todo/filegroup/:id")', 'req.body.userId: ' + req.body.userId);

		var id = req.params.id;
		//	var userId = req.body.userId;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		// get 1 new id  for the filegroup 

		deleteFileGroup(id, databaseMonitor).then(function() {
			var json = {
				filegroup_uid : id,
				msg : "Erfolgreich gelöscht"
			}
			utils.debugLog('route - del("/todo/filegroup/:id")', 'app.delete("/todo/filegroup")  success: ');
			res.json(json);
		}).fail(function(err) {
			utils.errorLog('route - del("/todo/filegroup/:id")', 'Query error in DEL  /todo/filegroup/:id    err: ' + err); 
			res.send(500, 'Query error in DEL  /todo/filegroup/:id     !');
		}).done(function() {
			utils.debugLog('route - del("/todo/filegroup/:id")', 'fertig in  DEL  /todo/filegroup/:id '); 
			databaseMonitor.end();
		});
	});
	
	app.delete("/todo/file/:id", utils.auth, function(req, res) {
		utils.debugLog('route - del("/todo/file/:id)', "matching request function DELETE '/todo/file/:id'");
		utils.debugLog('route - del("/todo/file/:id)', 'req.params.id: ' + req.params.id);
		utils.debugLog('route - del("/todo/file/:id)', 'req.body.userId: ' + req.body.userId);

		var id = req.params.id;
		//	var userId = req.body.userId;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		deleteFile(id, databaseMonitor).then(function() {
			var json = {
				file_uid : id,
				msg : "File erfolgreich gelöscht"
			}
			utils.debugLog('route - del("/todo/file/:id)', 'app.delete("/todo/file")  success: ');
			res.json(json);
		}).fail(function(err) {
			utils.errorLog('route - del("/todo/file/:id)', 'Query error in DEL  /todo/file/:id    err: ' + err); 
			res.send(500, 'Query error in DEL  /todo/file/:id     !');
		}).done(function() {
			utils.debugLog('route - del("/todo/file/:id)', 'fertig in  DEL  /todo/file/:id '); 
			databaseMonitor.end();
		});
	});
	


	app.post("/todo/newlink", utils.auth, function(req, res) {
		utils.debugLog('route - post("/todo/newlink")', "matching request function POST  '/todo/newlink'");
		utils.debugLog('route - post("/todo/newlink")', 'req.body.url: ' + req.body.url);
		utils.debugLog('route - post("/todo/newlink")', 'req.body.todo_uid: ' + req.body.todo_uid);
		utils.debugLog('route - post("/todo/newlink")', 'req.body.linkname: ' + req.body.linkname);

		var linkname = req.body.linkname;
		var todo_uid = req.body.todo_uid;
		var url = req.body.url;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		// get 1 new id  for the filegroup 

		getUniqueId(tableLinks, databaseMonitor).then(function(result) {
			var link_uid = result[0].insertId; // result of promise1
			utils.debugLog('route - post("/todo/newlink")', 'app.post("/todo/newlink")  link_uid: ' + link_uid);

			insertLink(link_uid, url, linkname, todo_uid, databaseMonitor).then(function() {
				var json = {
					link_uid : link_uid,
					linkname : linkname,
					url : url
				}
				utils.debugLog('route - post("/todo/newlink")', 'app.post("/todo/newlink")  success: ');
				res.json(json);
			}).fail(function(err) {
				utils.errorLog('route - post("/todo/newlink")', 'insertTodo ERROR in  POST  /todo/newlink err: ' + err); 
				res.send(500, 'Query error in POST  /todo/newlink !');
			}).done(function() {
				utils.debugLog('route - post("/todo/newlink")', 'insertTodo alles gut in  POST  /todo/newlink: '); 
				// databaseMonitor.end();
			});
		}).fail(function(err) {
			utils.errorLog('route - post("/todo/newlink")', 'ERROR  getUniqueId in  POST  /todo/newlink err: ' + err); 
			res.send(500, 'Query error in POST  /todo/newlink !');
		}).done(function() {
			utils.debugLog('route - post("/todo/newlink")', 'alles gut in  POST  /todo/newlink: '); 
			databaseMonitor.end();
		});
	});
	
	app.delete("/todo/link/:id", utils.auth, function(req, res) {
		utils.debugLog('route - del("/todo/link/:id")', "matching request function DELETE '/todo/link/:id'");
		utils.debugLog('route - del("/todo/link/:id")', 'req.params.id: ' + req.params.id);
		utils.debugLog('route - del("/todo/link/:id")', 'req.body.userId: ' + req.body.userId);

		var id = req.params.id;
		//	var userId = req.body.userId;

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		deleteLink(id, databaseMonitor).then(function() {
			var json = {
				link_uid : id,
				msg : "Link erfolgreich gelöscht"
			}
			utils.debugLog('route - del("/todo/link/:id")', 'app.delete("/link/file")  success: ');
			res.json(json);
		}).fail(function(err) {
			utils.errorLog('route - del("/todo/link/:id")', 'Query error in DEL  /todo/link/:id    err: ' + err); 
			res.send(500, 'Query error in DEL  /todo/link/:id     !');
		}).done(function() {
			utils.debugLog('route - del("/todo/link/:id")', 'fertig in  DEL  /todo/link/:id '); 
			databaseMonitor.end();
		});
	});

	app.post("/todo/fileupload", utils.auth, function(req, res) {
		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		var user_uid = req.body.user_uid;
		var username = req.body.username;
		var filegroup_uid = req.body.filegroup_uid;

		var oldDir = req.files.file.path;
		var filename = path.basename(oldDir);
		var filelocation = config.directories.downloadDir + '/' + username + '/';
		utils.debugLog('route - post("/todo/fileupload")', 'filename: ' + filename);
		utils.debugLog('route - post("/todo/fileupload")', 'oldDir: ' + oldDir);
		utils.debugLog('route - post("/todo/fileupload")', 'filelocation: ' + filelocation);

		if (!fs.existsSync(filelocation)) {
			utils.debugLog('route - post("/todo/fileupload")', 'mkdir: ' + filelocation);
			fs.mkdirSync(filelocation);
		}
		filelocation += filename;

		fs.renameSync(oldDir, filelocation);
		filename = req.files.file.originalFilename;

		getUniqueId(tableFiles, databaseMonitor).then(function(result) {
			var file_uid = result[0].insertId; // result of promise1
			utils.debugLog('route - post("/todo/fileupload")', 'app.post("/ttodo/fileupload")  file_uid: ' + file_uid);

			insertFile(file_uid, filename, filelocation, filegroup_uid, user_uid, databaseMonitor).then(function() {
				var f = {
					uid : file_uid,
					filename : filename,
					filelocation : filelocation,
					filegroup_uid : filegroup_uid,
					user_uid : user_uid
				};
				
				var json = {
					file : f,
					msg : "Fileupload successful!"
				};
				utils.debugLog('route - post("/todo/fileupload")', 'app.post("/todo/fileupload"  success: ');
				utils.debugLog('route - post("/todo/fileupload")', 'app.post("/todo/fileupload"  json: ' + JSON.stringify(json));
				res.json(json);
			}).fail(function(err) {
				utils.errorLog('route - post("/todo/fileupload")', 'ERROR  insertFile in  POST  /todo/fileupload err: '+ err);
				res.send(500, 'Query error in POST  /todo/fileupload !');
			}).done(function() {
				utils.debugLog('route - post("/todo/fileupload")', 'insertFile /todo/fileupload: ');
			});
		}).fail(function(err) {
			utils.errorLog('route - post("/todo/fileupload")', 'ERROR  getUniqueId in  POST  /todo/fileupload err: ' + err);
			res.send(500, 'Query error in POST  /todo/fileupload !');
		}).done(function() {
			utils.debugLog('route - post("/todo/fileupload")', 'alles gut in  POST  /todo/newfiles: ');
			databaseMonitor.end();
		});
	}); 
};
