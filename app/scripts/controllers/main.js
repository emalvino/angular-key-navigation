'use strict';

angular.module('ngKeyNavigationApp')
.controller('MainCtrl', function ($scope) {
	$scope.keyNavigationOptions = {
		cycle: true,
		strictHorizontal: true,
		followMouse: true
	};
	$scope.keyboard = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M']
	];
});
