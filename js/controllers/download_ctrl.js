angular.module('starter.controllers').controller('DownloadCtrl', function($scope, $ionicHistory, $location, $ionicPopup, ReportsDb, Spreadsheet) {

	// don't rely on this for any kind of security
	$scope.password = 'audit1971';
	$scope.authenticated = false;

	$scope.promptPassword = function () {
		console.log('prompting password');
		$scope.authenticated = false;
		$scope.confirmPassword = '';
		var myPopup = $ionicPopup.show({
			template: '<input type="password" ng-model="$parent.confirmPassword">',
		    title: 'Enter Password',
		    scope: $scope,
		    buttons: [
		    	{ text: 'OK',
		    	  type: 'button-positive'},
		    ]
		});

		myPopup.then(function (res) {
			if ($scope.password === $scope.confirmPassword) {
				$scope.authenticated = true;
				console.log('correct password');
			} else {
				console.log('wrong password');
			}
		});
	};

	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if ($location.path() == "/tab/download") {
			$scope.authenticated = false;
	    }

	});

	$scope.downloadAudits = function () {
		var callback = function (err, audits) {
			if (err) {
				throwDatabaseErr('Error downloading report.');
			} else {
				console.log('downloading audits');
				Spreadsheet.downloadSpreadsheet(audits);
			}
		}
		ReportsDb.getDirectory(callback);
	};

	$scope.deleteAudits = function () {
		console.log('deleting audits');
		var confirmCallback = function () {
			var callback = function (err) {
				if (err) {
					$scope.throwDatabaseErr(err);
				}
			}
			ReportsDb.clearDirectory(callback);
		}
		$scope.showConfirmationPopup(
			'Confirm Delete',
			'Are you sure you want to delete all audits?',
			confirmCallback);
	};

});