angular.module('starter.controllers').controller('SettingsCtrl', function($scope, StaffDb, Questions) {

	$scope.staffDirectory = [];
	$scope.reportDirectory = [];

	$scope.staffName = '';

	var refreshDirectory = function (getDirFunc, callback) {
		console.log('refreshingDirectory')
		getDirFunc(function (err, values) {
			console.log('database callback');
			if (err) {
				$scope.throwDatabaseErr(err);
			} else {
				callback(values);
				console.log('no database error');
				$scope.$apply();
			}
		});
	}

	$scope.refreshStaffDirectory = function () {
		refreshDirectory(StaffDb.getDirectory, function (values) {
			$scope.staffDirectory = values.sort(function (a, b) {
				return a.name.localeCompare(b.name);
			});
		});
	};

	$scope.refreshReportDirectory = function () {
		refreshDirectory(Questions.getReportDirectory, function (values) {
			$scope.reportDirectory = values;
		});
	};

	$scope.refreshStaffDirectory();
	$scope.refreshReportDirectory();

	var dbCallback = function (refresh) {
		return function (err) {
			if (err) {
				$scope.throwDatabaseErr(err);
			} else {
				refresh();
			}
		};
	}

	var dbCallbackStaff = dbCallback($scope.refreshStaffDirectory);
	var dbCallbackReport = dbCallback($scope.refreshReportDirectory);

	$scope.addReportToDirectory = function () {
		if ($scope.reportTitle   !== undefined && $scope.reportTitle   !== '' &&
			$scope.reportConfirm !== undefined && $scope.reportConfirm !== '') {

			Questions.addToDatabase(
				$scope.reportTitle, 
				$scope.reportConfirm, 
				dbCallbackReport);

			$scope.reportTitle   = '';
			$scope.reportConfirm = '';
		}
	};

	$scope.removeReportFromDirectory = function (index) {
		var confirmCallback = function () {
			Questions.removeFromDatabase($scope.reportDirectory[index], dbCallbackReport);
		};
		$scope.showConfirmationPopup(
			'Confirm Delete',
			'Are you sure you want to delete \'' + $scope.reportDirectory[index].title + '\'',
			confirmCallback);
	};

	$scope.addStaffToDirectory = function() {
		if ($scope.validateNewStaff($scope.staffDirectory, $scope.staffName)) {
			console.log('no error');
			StaffDb.addStaff($scope.staffName, dbCallbackStaff);
		}

		$scope.staffName = '';
	};

	$scope.removeStaffFromDirectory = function(index) {
		var confirmCallback = function () {
			StaffDb.removeStaffFromDirectory($scope.staffDirectory[index], dbCallbackStaff);
		};
		$scope.showConfirmationPopup(
			'Confirm Delete',
			'Are you sure you want to delete \'' + $scope.staffDirectory[index].name + '\'',
			confirmCallback);
	};

	var confirmRemoveStaff = function(index) {

	}
});