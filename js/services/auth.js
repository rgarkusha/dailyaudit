// this service handles authentication
angular.module('starter.services').factory('Auth', function() {
	
	var loggedIn = null;
	var staff = 'staff';
	var admin = 'admin';

	// really insecure
	var loginStaff = 'auditdaily';
	var loginAdmin = 'audit1971';

	return {

		admin: function() {
			return admin;
		},

		staff: function () {
			return staff;
		},

		loggedIn: function () {
			return loggedIn;
		},

		logIn: function (password) {
			if (password === loginStaff) {
				console.log('logged in as staff');
				loggedIn = staff;
			} else if (password === loginAdmin) {
				console.log('logged in as admin')
				loggedIn = admin;
			}
			return loggedIn;
		},
	};
});