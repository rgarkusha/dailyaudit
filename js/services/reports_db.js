angular.module('starter.services').factory('ReportsDb', function(DbTool) {
	var dbRef = new Firebase('https://exampledailyaudit.firebaseio.com/audits');
	return {
		save: function (staffList, supervisor, reports, callback) {
			
			var date = new Date();
			var dbObject = 
			{
				'date' : date.getTime(),
				'supervisor': supervisor,
				'reports': angular.copy(reports),
				'staffList' : angular.copy(staffList),
			};

			DbTool.pushToRemote(dbRef, dbObject, callback);
		},

		getDirectory: function (callback) {
			return DbTool.getDirectory(dbRef, callback);
		},

		clearDirectory: function (callback) {
			DbTool.clearDirectory(dbRef, callback);
		}
	};
})