'use strict';

angular.module('emKeyNavigation', [])
.directive('emKeyNavigationContainer', function () {
	return {
		restrict: 'EA',
		scope: {
			emKeyNavigationSelected: '=?',
			options: '=emKeyNavigationContainer'
		},
		controller: function($scope, $timeout) {
			$scope.directions = {
				left: {
					key: 37,
					axis: 'Horizontal',
					angle: {
						true: function(angle){ return angle === Math.PI; },
						false: function(angle){ return angle > Math.PI / 2 || angle < -Math.PI / 2; }
					}
				},
				right: {
					key: 39,
					axis: 'Horizontal',
					angle: {
						true: function(angle){ return angle === 0; },
						false: function(angle){ return angle < Math.PI / 2 && angle > -Math.PI / 2; }
					}
				},
				up: {
					key: 38,
					axis: 'Vertical',
					angle: {
						true: function(angle){ return angle === -Math.PI / 2; },
						false: function(angle){ return angle < 0 && angle > -Math.PI; }
					}
				},
				down: {
					key: 40,
					axis: 'Vertical',
					angle: {
						true: function(angle){ return angle === Math.PI / 2; },
						false: function(angle){ return angle > 0 && angle < Math.PI; }
					}
				}
			};
			$scope.navigableElements = [];
			$scope.currentElement = undefined;
			$scope.setCurrentElement = function(element){
				if($scope.currentElement !== element){
					$scope.currentElement = element;
					$scope.emKeyNavigationSelected = element.id;
					$timeout(function(){
						element.element.focus();
					},0);
					console.log($scope.emKeyNavigationSelected);
				}
			};
			this.registerNavigableElement = function(element){
				$scope.navigableElements.push(element);
				if(angular.isUndefined($scope.currentElement)){
					$scope.setCurrentElement(element);
				}
				var updateCallback = function(){
					$scope.setCurrentElement(element);
				};
				element.element.on('focus', updateCallback);
				$scope.$watch('options.followMouse', function(newValue){
					if(newValue === true){
						element.element.on('mouseover', updateCallback);
					}
					else{
						element.element.off('mouseover', updateCallback);
					}
				});
			};
			$scope.calculateDistance = function(offset1, offset2){
				var delta = {
					x: offset2.left - offset1.left,
					y: offset2.top - offset1.top
				};
				var result = {
					distance: Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2)),
					angle: Math.atan2(delta.y, delta.x)
				};
				return result;
			};
			$scope.getNextElement = function(direction, distance){
				console.log($scope.currentElement.element.html());
				var nextElement;
				var nextDistance;
				angular.forEach($scope.navigableElements, function(otherElement) {
					if(otherElement !== $scope.currentElement){
						var vectorDistance = $scope.calculateDistance($scope.currentElement.element.offset(), otherElement.element.offset());
						console.log(vectorDistance);
						var strict = $scope.options['strict' + direction.axis] === true;
						if(direction.angle[strict](vectorDistance.angle)){
							if(angular.isUndefined(nextElement) || distance(vectorDistance.distance, nextDistance.distance) === vectorDistance.distance){
								nextElement = otherElement;
								nextDistance = vectorDistance;
							}
						}
					}
				});
				return nextElement;
			};
			$scope.go = function(direction){
				var nextElement = $scope.getNextElement(direction, Math.min);
				if(angular.isUndefined(nextElement) && $scope.options.cycle){
					nextElement = $scope.getNextElement(direction, Math.max);
				}
				if(angular.isDefined(nextElement)){
					$scope.setCurrentElement(nextElement);
				}
			};
		},
		link: function postLink(scope, element) {
			element.on('keydown', function(event){
				angular.forEach(scope.directions, function(direction){
					if(event.keyCode === direction.key) {
						return scope.go(direction);
					}
				});
			});
		}
	};
})
.directive('emKeyNavigation', function(){
	return {
		restrict: 'A',
		require: '^emKeyNavigationContainer',
		link: function postLink(scope, element, attrs, controller) {
			var id = scope.$eval(attrs.emKeyNavigation);
			var thisElement = {element: element, id: id};
			controller.registerNavigableElement(thisElement);
		}
	};
});
