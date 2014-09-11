'use strict';

angular.module('emKeyNavigation', [])
.directive('emKeyNavigationContainer', function () {
	return {
		restrict: 'EA',
		scope: {
			emKeyNavigationSelected: '=?',
			options: '=emKeyNavigationContainer'
		},
		controller: ['$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {
			//Utility function
			$scope.hasOptions = function(option1, option2, option3){
				if(angular.isUndefined($scope.options)){
					return false;
				}
				if(angular.isUndefined($scope.options[option1])){
					return false;
				}
				if(angular.isDefined(option2) && angular.isUndefined($scope.options[option1][option2])){
					return false;
				}
				if(angular.isDefined(option3) && angular.isUndefined($scope.options[option1][option2][option3])){
					return false;
				}
				return true;
			};
			$scope.isTrue = function(option){
				return $scope.hasOptions(option) && $scope.options[option] === true;
			};
			$scope.directions = {
				left: {
					name: 'left',
					keys: [37],
					axis: 'Horizontal',
					angle: {
						true: function(angle){ return angle === Math.PI; },
						false: function(angle){ return angle > Math.PI / 2 || angle < -Math.PI / 2; }
					}
				},
				right: {
					name: 'right',
					keys: [39],
					axis: 'Horizontal',
					angle: {
						true: function(angle){ return angle === 0; },
						false: function(angle){ return angle < Math.PI / 2 && angle > -Math.PI / 2; }
					}
				},
				up: {
					name: 'up',
					keys: [38],
					axis: 'Vertical',
					angle: {
						true: function(angle){ return angle === -Math.PI / 2; },
						false: function(angle){ return angle < 0 && angle > -Math.PI; }
					}
				},
				down: {
					name: 'down',
					keys: [40],
					axis: 'Vertical',
					angle: {
						true: function(angle){ return angle === Math.PI / 2; },
						false: function(angle){ return angle > 0 && angle < Math.PI; }
					}
				}
			};
			$scope.directions.left.opposite = $scope.directions.right;
			$scope.directions.right.opposite = $scope.directions.left;
			$scope.directions.up.opposite = $scope.directions.down;
			$scope.directions.down.opposite = $scope.directions.up;
			// Check for keys overrides
			if($scope.hasOptions('keys')){
				angular.forEach($scope.options.keys, function(value, key){
					$scope.directions[key].keys = value;
				});
			}
			$scope.navigableElements = [];
			$scope.currentElement = undefined;
			$scope.setCurrentElement = function(element, event){
				if($scope.currentElement === element){
					return;
				}
				$scope.currentElement = element;
				$scope.emKeyNavigationSelected = element.id;
				if(angular.isUndefined(event) || event.type !== 'focus'){
					$timeout(function(){
						element.element.focus();
					},0);
				}
			};
			this.registerNavigableElement = function(element){
				$scope.navigableElements.push(element);
				if(angular.isUndefined($scope.currentElement)){
					$scope.setCurrentElement(element);
				}
				var updateCallback = function(event){
					$scope.setCurrentElement(element, event);
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
				// Check for override
				if($scope.hasOptions('overrides', $scope.currentElement.id, direction.name)){
					var override = $scope.options.overrides[$scope.currentElement.id][direction.name];
					return $filter('filter')($scope.navigableElements, {id: override})[0];
				}
				var nextElement;
				var nextDistance;
				angular.forEach($scope.navigableElements, function(otherElement) {
					if(otherElement !== $scope.currentElement){
						var vectorDistance = $scope.calculateDistance($scope.currentElement.element.offset(), otherElement.element.offset());
						var strict = $scope.isTrue('strict' + direction.axis);
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
				if(angular.isUndefined(nextElement) && $scope.isTrue('cycle')){
					nextElement = $scope.getNextElement(direction.opposite, Math.max);
				}
				if(angular.isDefined(nextElement)){
					$scope.setCurrentElement(nextElement);
				}
			};
		}],
		link: function postLink(scope, element) {
			element.on('keydown', function(event){
				angular.forEach(scope.directions, function(direction){
					if(direction.keys.indexOf(event.keyCode) > -1) {
						if(scope.isTrue('preventDefault')){
							event.preventDefault();
						}
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
