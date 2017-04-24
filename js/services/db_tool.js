angular.module('starter.services').factory('DbTool', function($ionicPopup) {
	return {

		getDirectory : function (dbRef, callback) {
			try {
				dbRef.once('value', function (snapshot) {
					var index = 0;
					values = [];
					snapshot.forEach(function(childSnapshot) {
						values[index] = childSnapshot.val();
						values[index].key = childSnapshot.key();
						index++;
					});
					// alert(JSON.stringify(values, null, 4));
					callback(null, values);
				}, callback);
			} catch (err) {
				callback(err);
			}
		},

		clearDirectory: function (dbRef, callback) {
			dbRef.set(null, callback);
		},

		pushToRemote: function (dbRef, dbObject, callback) {
			var result;
			try {
				result = dbRef.push(dbObject, callback);
			} catch (err) {
				callback(err);
			}
			return result;
		},

		removeFromRemote: function(dbRef, key, callback) {
			dbRef.child(key).set(null, callback);
		},

		throwDatabaseErr: function (errMsg) {
			console.log('Firebase Error: ' + errMsg);
			var alertPopup = $ionicPopup.alert({
				title: 'Database Error',
				template: 'Something went wrong with the database. Are you connected to the Internet?'
			})
		},

	};
})