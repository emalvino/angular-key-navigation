'use strict';

angular.module('emKeyNavigation', [])
.directive('emKeyNavigationContainer', function () {
	return {
		restrict: 'EA',
		scope: {},
		controller: function($scope) {
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
				$scope.currentElement = element;
				$scope.$currentFocused = element.id;
				element.element.focus();
				console.log($scope.$currentFocused);
			};
			this.registerNavigableElement = function(element, id){
				var newElement = {
					element: element,
					id: id
				};
				$scope.navigableElements.push(newElement);
				if(angular.isUndefined($scope.currentElement)){
					$scope.setCurrentElement(newElement);
				}
				console.log($scope.navigableElements);
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
		link: function postLink(scope, element, attrs) {
			scope.options = scope.$eval(attrs.emKeyNavigationContainer);
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
		scope: {},
		link: function postLink(scope, element, attrs, controller) {
			var id = attrs.emKeyNavigation;
			controller.registerNavigableElement(element, id);
		}
	};
});
