angular.module('starter.controllers').controller('AuditCtrl', function($scope, $state, $location, $ionicPopup, Reports, ReportsDb, StaffDb) {

	// $scope.reports = [];

	$scope.refreshReports = function () {
		Reports.all().then(function (result) {
			// array containing reports
			$scope.reports = result;
		});
	};

	$scope.resetValues = function () {
		// supervisor object contains supervisor name, shift and floor
		$scope.supervisor = {
			name: '',
			shift: -1,
			floor: -1,
		};
		// List of staff currently working on the floor
		$scope.staffList = [];

		// stores index of staff that have incidents
		$scope.values = [];

		// true if staff accepted the terms.
		$scope.terms = false;
	}

	$scope.resetValues();
	$scope.refreshReports();

	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		console.log("State changed: ", toState);

		if ($location.path() == "/tab/audit") {
			$scope.refreshReports();
			$scope.resetValues();
	    }

	});

	$scope.queryStaffNames = function (query) {
		return StaffDb.getStaffNames(query);
	};

	$scope.staffDirectory = [];

	$scope.refreshStaffNames = function () {
		$scope.queryStaffNames().then( function (results) {
			$scope.staffDirectory = results;
		})
	};
	
	$scope.refreshStaffNames();

	$scope.addDailyStaff = function () {
		$scope.refreshStaffNames();
		var myPopup = $ionicPopup.show({
			templateUrl: 'add-staff.html',
			title: 'Add/Remove Staff To Schedule',
			subTitle: 'Please check the names of all staff working during your shift.',
			scope: $scope,
			buttons: [
				// {
				// 	text:'Cancel'
				// },
			  	{
					text: '<b>OK</b>',
			    	type: 'button-positive',
			    	onTap: function(e) {
			    		return true;
			    	}
			  	}
			]
		});

		myPopup.then(function(res) {
			if (res) {
				console.log('adding staff to schedule');
			}
		});
	};

	$scope.setShift = function (index) {
		$scope.supervisor.shift = index;
		console.log("setting shift to " + index);
	};

	$scope.setFloor = function (index) {
		$scope.supervisor.floor = index;
		console.log('setting floor to ' + index);
	};

	// Add a staff name to the list
	$scope.addStaff = function (staffArray, staffName) {
		if ($scope.validateNewStaff(staffArray, staffName)) {
			staffArray.push({
				name: staffName
			});
		}
	};

	$scope.addWorkingStaff = function() {
		$scope.addStaff($scope.staffList, $scope.staffName);
		$scope.staffName = '';
	};

	$scope.addStaffToSchedule = function (name) {
		$scope.staffName = name;
		$scope.addWorkingStaff();
	}

	$scope.removeStaffFromSchedule = function (name) {
		console.log('removing ' + name + ' from schedule');
		$scope.staffList = $scope.staffList.filter(function(item) {
			return name !== item.name;
		});
	}

	$scope.staffIsInSchedule = function (name) {
		var found = false;
		var filtered = $scope.staffList.filter( function(item) {
			if (name.toLowerCase() === item.name.toLowerCase()) {
				found = true;
				return true;
			} else {
				return false;
			}
		});
		return found;
	}

	// If the staff name exists in the schedule, it will be removed
	// if it's not, it will be added
	$scope.toggleStaffSchedule = function (name) {
		if ($scope.staffIsInSchedule(name)) {
			$scope.removeStaffFromSchedule(name);
		} else {
			$scope.addStaffToSchedule(name);
		}
	}

	$scope.removeWorkingStaff = function(index) {
		$scope.removeStaff(index, $scope.staffList);
	}


	// Pops a dialog to enter an incident report for the given item
	$scope.showIncidentReportDlg = function (reportId) {

		if ($scope.staffList.length > 0) {

			var myPopup = $ionicPopup.show({
				templateUrl: 'incident-names.html',
				title: $scope.reports[reportId].title + ' - Incident Report',
				subTitle: 'Select staff to file report for and a description.',
				scope: $scope,
				buttons: [
					{
						text:'Cancel'
					},
				  	{
						text: '<b>Add</b>',
				    	type: 'button-positive',
				    	onTap: function(e) {
				    		if (!$scope.report) {
				    			e.preventDefault();
				    		} else {
				    			return $scope.report;
				    		}
				    	}
				  	}
				]
			});

			myPopup.then(function(res) {
				if (res) {
					$scope.createReport(reportId, res);
				}
				$scope.values = [];
				$scope.report = "";
			});

		} else {
			var alertPopup = $ionicPopup.alert({
		     	title: 'No staff found!',
		     	template: 'Please enter the names of staff working today.'
		   	});
		}

	};

	// Pops a dialog to document the incident for the selected staff
	$scope.createReport = function (reportId, report) {
		var incident = {
			staffList: [],
			description: report,
		};
		console.log($scope.values);
		for (var i = 0; i < $scope.staffList.length; i++) {
			if ($scope.values[i]) {
				incident.staffList.push($scope.staffList[i]);
				console.log("incident for: " + $scope.staffList[i].name);
			}
		}
		console.log("creating incident report! " + $scope.report);
		$scope.reports[reportId].incidents.push(incident);
	};

	$scope.removeIncident = function (reportId, incidentId) {
		$scope.reports[reportId].incidents.splice(incidentId, 1);
	};

	isFormIncomplete = function () {
		var hasErr = false;
		var errMsg = '';
		if ($scope.supervisor.name === '') {
			hasErr = true;
			errMsg += " your Name" + ",";
		}
		if ($scope.supervisor.shift === -1) {
			hasErr = true;
			errMsg += " your Shift" + ",";
		}
		if ($scope.supervisor.floor === -1) {
			hasErr = true;
			errMsg += " your Floor" + ",";
		}
		for (var i = 0; i < $scope.reports.length; i++) {
			var report = $scope.reports[i];
			if (report.incidents.length === 0 && report.ok != true) {
				hasErr = true;
				errMsg += " " + report.title + ",";
			}
		}

		if (hasErr) {
			return errMsg.slice(0, -1); // remove trailing ','
		}
	}

	$scope.submit = function () {
		var err = isFormIncomplete();
		if (err) {

			var alertPopup = $ionicPopup.alert({
			    	title: 'Please fill out all fields',
			     	template: 'Please check:' + err
			  });

		} else {

			var callback = function (err) {
				if (err) {
					$scope.throwDatabaseErr(err);
				} else {
					$state.go('tab.complete');
				}
			};
			ReportsDb.save($scope.staffList, $scope.supervisor, $scope.reports, callback);

		}
	};
});