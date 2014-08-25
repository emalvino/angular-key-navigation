angular-key-navigation
======================
**Still under development**

##Description
AngularJS directive to navigate focusable elements (anchors, buttons, inputs, etc) using keys.
It relies on the keydown event, so it applies to keyboards and smart-tv remote control events.

##Installation
TODO

##em-key-navigation-container
Container directive. It handles all the key events and calculates the next element to be focused based on it's position.
```HTML
<div em-key-navigation-container>
...
</div>
```
It exposes a property to store the currently selected item on the scope, using the `selected` attribute:
```HTML
<div em-key-navigation-container selected="currentlySelected">
	<a ng-href="#" em-key-navigation="detail">Detail</a>
	<a ng-href="#" em-key-navigation="home">Home</a>
	Currently selected item is: {{currentlySelected}}
</div>
```
Or for example, to highlite the selected element:
```HTML
<div em-key-navigation-container selected="currentlySelected">
	<a ng-href="#" ng-class="{'active': currentlySelected === 'detail'}" em-key-navigation="detail">Detail</a>
	<a ng-href="#" ng-class="{'active': currentlySelected === 'home'}" em-key-navigation="home">Home</a>
</div>
```
It can optionally use a configuration object:
```HTML
<div em-key-navigation-container="navigationOptions">
...
</div>
```

###Configuration options
Option          |Default value|Description
cycle           |false        |If true once the last element on a direction is reached and another key event in that direction is received, it will wrap to the first element. Otherwise it will just stay there.
strictHorizontal|false        |If true only elements on the same height* will be considered when moving left or right. Otherwise it will go to the nearest element regardless of it's vertical position.
strictVertical  |false        |If true only elements on the same horizontal position* will be considered when moving up or down. Otherwise it will go to the nearest element regardless of it's horizontal position.
followMouse     |false        |If true the focused element will be updated when the mouse moves over it (`mouseover` event).
*Acording to the result from the element's offset() method.
Example:
```JavaScript
$scope.navigationOptions={
	cycle: true,
	strictHorizontal: true,
	strictVertical: false,
	followMouse: true
};
```
##em-key-navigation
Directive used on each focusable element to register them and be taken into account when navigating using the keyboard. In that way it is possible to decide which elements should be key navigables and which don't.
```HTML
<a ng-href="#" em-key-navigation>Detail</a>
```
In order to be able to identify the currently focused element (as described on the `selected` attribute from the container directive), an id should be provided.
