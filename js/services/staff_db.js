angular.module('starter.services').factory('StaffDb', function($q, DbTool) {
	var dbRef = new Firebase('https://exampledailyaudit.firebaseio.com/staff');
	return {
		addStaff: function (staffName, callback) {
			var dbObject = {
				'name' : staffName
			};
			return DbTool.pushToRemote(dbRef, dbObject, callback);
		},

		removeStaffFromDirectory: function(staff, callback) {
			DbTool.removeFromRemote(dbRef, staff.key, callback);
		},

		getStaffNames: function (query) {
			var deferred = $q.defer();
			var callback = function (err, vals) {
				if (err) {
					deffered.reject('Database Error');
				} else {
					var values = vals.map( function (staff) {
						return staff.name.toLowerCase();
					});
					if (query != undefined) {
						console.log('query is ' + query);
						query = query.toLowerCase();
						values = values.filter( function(str) {
							return str.indexOf(query) > -1;
						});
					}
					deferred.resolve(values);
				}
			}
			DbTool.getDirectory(dbRef, callback);
			return deferred.promise;
		},

		getDirectory: function (callback) {
			DbTool.getDirectory(dbRef, callback);
		}
	};
})