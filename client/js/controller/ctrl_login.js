'use strict'; 

app.controller('LoginCtrl', function($scope, $http, $location, $rootScope) {
	// 	This object will be filled by the form
	$scope.loginForm = {};

	  // Register the login() function
	$scope.sendLoginForm = function() {
		console.log('username: '+ $scope.loginForm.username);
		console.log('password: '+ $scope.loginForm.password);
		var data = {
			username: $scope.loginForm.username,
			password: $scope.loginForm.password,
		}; 
		console.log('data: '+ JSON.stringify(data));

		$http.post('/login', data).success(function(user, status, headers, config) {
	    	// No error: authentication OK
	    	console.log('login successful sfsdfdsf');
	    	$scope.alertSuccessMessage = 'Authentication successful.';
	    	console.log('login successful user: ' + JSON.stringify(user));

		    $scope.showError = false;
		    $scope.showSuccess = true;
	    	$location.url('/projekte');
	    	$rootScope.isLoggedIn = true;
	    	$rootScope.user = user; 
	    	console.log('login successful status: ' + JSON.stringify(status));  
	    	console.log('login successful headers: ' + JSON.stringify(headers));  
	    	console.log('login successful config: ' + JSON.stringify(config));
	    })
	    .error(function(data, status, headers, config) {
	    	// Error: authentication failed#	    	
	    	console.log('login error. data from server: ' + JSON.stringify(data));
	    	console.log('login error. status from server: ' + JSON.stringify(status));
	    	console.log('login error. headers from server: ' + JSON.stringify(headers));
	    	console.log('login error. config from server: ' + JSON.stringify(config));

	      $scope.alertErrorMessage = 'Authentication failed.';
	      $scope.showError = true;
	      $scope.showSuccess = false; 
	      $location.url('/login');
	      $rootScope.isLoggedIn = false;
	      $rootScope.user = {};
	    });
	  };
});
