// REST routes for file download

'use strict';

exports.addRoutes = function(app, config, utils) {
	
	app.get("/file/download/:id", utils.auth, function(req, res) {
		utils.debugLog('route - get("/file/download/:id)', "start");
		utils.debugLog('route - get("/file/download/:id)', 'req.params.id: ' + req.params.id);
	
		var database = db.getDbConnection(); 
	
		var file_uid = req.params.id;
		getFile(file_uid, database).then(function(result) {
			var f = result[0][0];
			utils.debugLog('route - get("/file/download/:id)', 'f: ' + JSON.stringify(f));
			res.download(f.filelocation, f.filename);
		}).fail(function(err) {
			utils.debugLog('route - get("/file/download/:id)', 'ERROR  ' + err);
			res.send(500, 'Query error in GET  /file/download/:id !');
		}).done(function() {
			utils.debugLog('route - get("/file/download/:id)', 'finished request');
			database.closeDbConnection();
		});
	});
};
