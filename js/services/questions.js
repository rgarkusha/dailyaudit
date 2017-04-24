angular.module('starter.services').factory('Questions', function(DbTool) {
	var dbRef = new Firebase('https://exampledailyaudit.firebaseio.com/reports');

	return {
		addToDatabase: function(reportTitle, reportDescription, callback) {
			var result;
			var dbObject = {
				'title' : reportTitle,
				'ok_title'    : reportDescription,
			};

			DbTool.pushToRemote(dbRef, dbObject, callback);
		},
		removeFromDatabase: function(report, callback) {
			DbTool.removeFromRemote(dbRef, report.key, callback);
		},
		getReportDirectory: function(callback) {
			DbTool.getDirectory(dbRef, callback);
		},
	}
})