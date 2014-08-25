'use strict';

angular.module('ngKeyNavigationApp')
.controller('MainCtrl', function ($scope) {
	$scope.keyNavigationOptions = {
		cycle: true,
		strictHorizontal: true,
		followMouse: true
	};
	$scope.keyboard = [
		['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M']
	];
});
