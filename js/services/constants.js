angular.module('starter.services').factory('Constants', function() {
	var shift = ['Morning', 'Evening', 'Night'];
	var floor = ['Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
	var colorWheel = [
		'calm', 
		'balanced', 
		'energized', 
		'assertive'
	];

	return {
		shifts: shift,
		floors: floor,
		getButtonColor : function (index) {
			return 'button-' + colorWheel[index % colorWheel.length];
		}
	};
})