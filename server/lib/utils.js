'use strict';

var fs = require('fs'); 
var config = require('../config');

module.exports = function() {
	
	function mysql_real_escape_string(str) {
		return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
			switch (char) {
			case "\0":
				return "\\0";
			case "\x08":
				return "\\b";
			case "\x09":
				return "\\t";
			case "\x1a":
				return "\\z";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\"":
			case "'":
			case "\\":
			case "%":
				return "\\" + char; // prepends a backslash to backslash, percent,
				// and double/single quotes
			}
		});
	}
	
	function auth(req, res, next) {
		if (process.env.NODE_ENV === 'development') {
			next();
		} else {
			if (!req.isAuthenticated())
				res.send(401);
			else
				next();
		}
	};
	
	function errorLog(component, errorMsg1, errorMsg2) {
		var date = new Date();
		console.log('errorLog');
		var msg = date + '\t---' + component + '---\t' + errorMsg1 + '\t' + errorMsg2 + '\n';   
		fs.appendFile(config.directories.logDir + '/' + config.logFiles.errorLog, msg);	
		console.log('ERROR. '+msg);
	};
	
	function debugLog(component, msg1, msg2) {
		var date = new Date();
		console.log('debugLog'); 
		var msg = date + '\t---' + component + '---\t' + msg1 + '\t' + msg2 + '\n';
		fs.appendFile(config.directories.logDir + '/' + config.logFiles.debugLog, msg);		
		console.log('DEBUG. '+msg);
	};

    return {
    	auth						: auth,
    	mysql_real_escape_string	: mysql_real_escape_string,
    	errorLog					: errorLog,
    	debugLog					: debugLog
    };
    
}(); 