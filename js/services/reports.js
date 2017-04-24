angular.module('starter.services').factory('Reports', function($q, Questions) {

	var reports = [];

	var clearAll = function (array) {
		for (var i = 0; i < reports.length; i++) {
			reports[i].id = i;
			reports[i].ok = false;
			reports[i].incidents = [];
		}
	}

	clearAll();

	return {
		all: function() {
			//return reports;
			var deferred = $q.defer();
			reports = [];
			var callback = function (err, values) {
				if (err) {
					DbTool.throwDatabaseErr('Error loading reports');
					deferred.reject("db error");
				} else {
					reports = values;
					clearAll();
					console.log('resolving reports from db');
					deferred.resolve(reports);
				}
			};
			Questions.getReportDirectory(callback);
			return deferred.promise;
		},
		get: function(reportId) {
			for (var i = 0; i < reports.length; i++) {
				if (reports[i].id === parseInt(reportId)) {
					return reports[i];
				}
			}
		},
		addIncident: function(reportId, incident) {
			reports[parseInt(reportId)].incidents.push(incident);
		},
		removeIncident: function(reportId, incidentId) {
			reports[parseInt(reportId)].incidents.splice(parseInt(incidentId), 1);
		},
		clearAllReports: function () {
			clearAll();
		},
	};

});