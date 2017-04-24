angular.module('starter.controllers')
.controller('AppCtrl', function($scope, $state, $window, Constants, DbTool, $ionicPopup, Auth) {
	console.log('App control is active!');

	$scope.promptPassword = function (callback) {
		console.log('prompting password');
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
			callback($scope.confirmPassword);
		});
	};

	$scope.loggedIn = function () {
		return Auth.loggedIn();
	};

	$scope.loggedInAsStaff = function () {
		return Auth.loggedIn() === Auth.staff();
	};

	$scope.loggedInAsAdmin = function () {
		return Auth.loggedIn() === Auth.admin();
	};
 
	$scope.logIn = function () {
		console.log('logging In');
		var goToAudit = function () {
			if (Auth.loggedIn()) {
				$state.go('tab.audit');
				return true;
			}
		};
		var callback = function (password) {
			Auth.logIn(password);
			goToAudit();
		}
		if (!goToAudit()) {
			$scope.promptPassword(callback);
		}
	};

	$scope.showAllStaffTabs = function () {
		if (Auth.loggedIn()) {
			return '';
		} else {
			return 'ng-hide';
		}
	}

	$scope.showSettings = function () {
		return $scope.showAllStaffTabs();
	}

	$scope.showDownload = function () {
		if (Auth.loggedIn() === Auth.admin()) {
			return '';
		} else {
			return 'ng-hide';
		}
	}

	$scope.showLogout = function () {
		return $scope.showAllStaffTabs();
	}

	$scope.logOut = function () {
		// $window.location.href = 'http://www.googledrive.com/host/0BzPof9aK-ahTNldCQ0pmQXpTVVU';
		$window.location.reload();
	}

	$scope.getShifts = function () {
		return Constants.shifts;
	};

	$scope.getFloors = function () {
		return Constants.floors;
	};

	$scope.getBtnColor = function (index) {
		return Constants.getButtonColor(index);
	};

	$scope.goHome = function () {
		$state.go('tab.home');
	};

	$scope.goSettings = function () {
		$state.go('tab.settings');
	};

	$scope.goDownload = function () {
		$state.go('tab.download');
	};

	$scope.throwDatabaseErr = function (errMsg) {
		DbTool.throwDatabaseErr(errMsg);
	};

	// checks if the name of a new staff is valid.
	// returns true if there is no duplicates, and the name is not empty
	// else returns false
	$scope.validateNewStaff = function(staffArray, staffName) {
		// check for duplicates
		var obj = staffArray.filter(function (obj) {
			return obj.name === staffName;
		})[0];

		if (obj === undefined 
				&& staffName !== ""
				&& staffName !== undefined) {
			console.log("Staff name is valid " + staffName);
			return true;
		} else {
			console.log("Invalid staff name " + staffName);
			return false;
		}
	}

		// Remove staff at index from list
	$scope.removeStaff = function (index, staffArray) {
		staffArray.splice(index, 1);
	};

	// shows a confirmation popup with the given title, and text.
	// calls callback if 'yes' is pressed
	$scope.showConfirmationPopup = function (title, txt, callback) {
		var alertPopup = $ionicPopup.alert({
		     	title: title,
		     	template: txt,
		     	buttons: [
					{
						text:'No'
					},
				  	{
						text: '<b>Yes</b>',
				    	type: 'button-positive',
				    	onTap: function(e) {
				    		return true;
				    	}
				  	}
				]
		   	});
		alertPopup.then(function (res) {
			if (res) {
				callback();
			}
		});
	}

});