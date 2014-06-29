// REST routes for projects: add, delete, update etc

'use strict';

exports.addRoutes = function(app, config, utils) {
	 
	// create a new project
	app.post("/newproject", utils.auth, function(req, res) {
		utils.debugLog('route - post("/newproject")', 'start');
				
		utils.debugLog('route - post("/newproject")', 'req.body.projecttitle: ' + req.body.projecttitle);
		utils.debugLog('route - post("/newproject")', 'req.body.user_uid: ' + req.body.user_uid);

		var projecttitle = req.body.projecttitle;
		var etherpadName1 = req.body.etherpadTopics;
		var etherpadName2 = req.body.etherpadProtocol;
		var user_uid = req.body.user_uid;

		utils.debugLog('route - post("/newproject")', 'etherpadName1: ' + etherpadName1);
		utils.debugLog('route - post("/newproject")', 'etherpadName2: ' +etherpadName2);

		utils.debugLog('route - post("/newproject")', 'newproject   req.body: ' + JSON.stringify(req.body));
 
		// get 3 new ids for the project and 2 etherpads 

		var group = Q.all([ getUniqueId(tableProjects, databaseMonitor),
				getUniqueId(tableEtherpads, databaseMonitor),
				getUniqueId(tableEtherpads, databaseMonitor)]);

		group.then(function(array) {
			var project_uid = array[0][0].insertId; // result of promise1
			var etherpadUid1 = array[1][0].insertId; // result of promise2
			var etherpadUid2 = array[2][0].insertId; // result of promise2

			utils.debugLog('route - post("/newproject")', ' in group.then projecttitle: ' +  projecttitle); 

			var group2 = Q.all([
			    insertNewProject(projectUid, project_uid, user_uid, databaseMonitor),
				insertEtherpad(etherpadUid1, etherpadName1, project_uid, user_uid, databaseMonitor),
				insertEtherpad(etherpadUid2, etherpadName2, project_uid, user_uid, databaseMonitor)]);

			group2.then(function(array2) {
				var json = {
					project_uid : project_uid,
					msg : "Projekt erfolgreich angelegt",
					etherpadTopicsUid : etherpadUid1,
					etherpadProtocolUid : etherpadUid2,
					projecttitle : projecttitle
				}
				utils.debugLog('route - post("/newproject")', ' success: ');
				res.json(json);
			}).fail(function(err) {
				utils.errorLog('route - post("/newproject")', 'group2 ERROR in  POST  /newproject err: ' + err); 
				res.send(500, 'Query error in POST  /newproject !');
			}).done(function() {
				utils.debugLog('route - post("/newproject")', 'group2 finished '); 
				// databaseMonitor.end();
			});
		}).fail(function(err) {
			utils.errorLog('route - post("/newproject")', 'ERROR: ' + err); 
			res.send(500, 'Query error in POST  /newproject !');
		}).done(function() {
			utils.debugLog('route - post("/newproject")', 'finished request : '); 
			databaseMonitor.end();
		});
	});
	
	// get a list of all projects
	// TODO: get only projects where the user has access rights ...
	
	app.get("/projects", utils.auth, function(req, res) {
		utils.debugLog('route - post("/newproject")',"matching request function GET  '/projects'");

		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		var group = Q.all([ getAllProjects(databaseMonitor),
		    getAllEtherpads(databaseMonitor), getAllTasks(databaseMonitor),
			getAllFileGroups(databaseMonitor), getAllFiles(databaseMonitor),
			getAllLinks(databaseMonitor) ]);

		group.then(function(array) {
			var json = {
				projects : array[0][0],
				etherpads : array[1][0],
				tasks : array[2][0],
				fileGroups : array[3][0],
				files : array[4][0],
				links : array[5][0]
			}
			res.json(json);
		}).fail(function(err) {
			utils.debugLog('route - post("/newproject")','ERROR in  GET  /projects err: ' + err); 
			res.send(500, 'Query error in GET  /projects !');
		}).done(function() {
			utils.debugLog('route - post("/newproject")','alles gut in  POST  /projects: '); 
			databaseMonitor.end();
		});
	}); 
	
	// user uploads a file to a specific project
	app.post("/project/fileupload", utils.auth, function(req, res) {
		var databaseMonitor = mysql.createConnection({
			host : config.databaseMonitor.host,
			user : config.databaseMonitor.username,
			password : config.databaseMonitor.password,
			database : config.databaseMonitor.database,
			debug : false
		});

		var user_uid = req.body.user_uid;
		var username = req.body.username;
		var project_uid = req.body.project_uid;

		var oldDir = req.files.file.path;
		var filename = path.basename(oldDir);
		var filelocation = config.directories.downloadDir + '/' + username + '/';

		if (!fs.existsSync(filelocation)) {
			utils.debugLog('route - post("/project/fileupload")', 'mkdir: ' +filelocation); 
			fs.mkdirSync(filelocation);
		}
		filelocation += filename;

		// this is linux "mv oldDir  filelocation"
		fs.renameSync(oldDir, filelocation);

		filename = req.files.file.originalFilename;

		getUniqueId(tableFiles, databaseMonitor).then(function(result) {
			var file_uid = result[0].insertId; // result of promise1
			utils.debugLog('route - post("/project/fileupload")', 'file_uid: ' + file_uid);
			insertFileForProject(file_uid, filename, filelocation, project_uid, user_uid, databaseMonitor).then(function() {
				var f = {
					uid : file_uid,
					filename : filename,
					filelocation : filelocation,
					project_uid : project_uid,
					user_uid : user_uid
				};
				var json = {
					file : f,
					msg : "Fileupload successful!"
				};
				utils.debugLog('route - post("/project/fileupload")', 'file upload success: ' + file_uid);
				res.json(json);
			}).fail(function(err) {
				res.send(500, 'Query error in POST  /project/fileupload !');
				utils.errorLog('route - post("/project/fileupload")', '"insertFileForProject" error: ' + err);
			}).done(function() {
				utils.debugLog('route - post("/project/fileupload")', 'finished "insertFileForProject"');
			});
		}).fail(function(err) {
			res.send(500, 'Query error in POST  /project/fileupload !');
			utils.errorLog('route - post("/project/fileupload")', 'error: ' + err);
		}).done(function() {
			utils.debugLog('route - post("/project/fileupload")', 'finished request, closing DB connection');
			databaseMonitor.end();
		});
	});
};
