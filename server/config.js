'use strict';

var path = require('path');

module.exports = {
	server : {
		listenPort : 1340, // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
	},
	directories : {
		clientDir : path.resolve(__dirname, '../client'),
		htmlFiles : '/templates',
		downloadDir : path.resolve(path.resolve(__dirname, '../client'), 'download/'),
		uploadDir : '../uploads',
		logDir    : 'log'
	},
	databaseMonitor : {
		username : 'pm_new',
		password : 'pm_new',
		database : 'pm_new',
		host : 'localhost'
	},
	tables : {
		projects : 'projects',
		uniqueIds : 'unique_id',
		etherpads : 'etherpads',
		todos : 'todos',
		filegroups : 'todofilegroup',
		files : 'todofiles',
		links : 'todolink',
		user : 'user'
	},
	logFiles : {
		debugLog : 'debug.log',
		errorLog : 'error.log'
	}
};
