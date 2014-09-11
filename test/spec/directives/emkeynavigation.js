/*global $:false */
'use strict';

describe('Directive: emKeyNavigation', function () {

  // load the directive's module
  beforeEach(module('emKeyNavigation'));

  var element, scope;
  var offsetMocks = {
    a: {top: 0, left: 0},
    b: {top: 0, left: 10},
    c: {top: 0, left: 20},
    d: {top: 10, left: 0},
    e: {top: 10, left: 10},
    f: {top: 10, left: 20},
    g: {top: 20, left: 0},
    h: {top: 20, left: 10},
    i: {top: 20, left: 20}
  };

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));
  describe('Basic navigation', function(){
    beforeEach(inject(function($compile) {
      element = angular.element(
        '<div em-key-navigation-container em-key-navigation-selected="selected">' +
        '<a href="#" em-key-navigation="\'a\'" id="a">a</a>' +
        '<a href="#" em-key-navigation="\'b\'" id="b">b</a>' +
        '<a href="#" em-key-navigation="\'c\'" id="c">c</a>' +
        '<br/>' +
        '<a href="#" em-key-navigation="\'d\'" id="d">d</a>' +
        '<a href="#" em-key-navigation="\'e\'" id="e">e</a>' +
        '<a href="#" em-key-navigation="\'f\'" id="f">f</a>' +
        '<br/>' +
        '<a href="#" em-key-navigation="\'g\'" id="g">g</a>' +
        '<a href="#" em-key-navigation="\'h\'" id="h">h</a>' +
        '<a href="#" em-key-navigation="\'i\'" id="i">i</a>' +
        '</div>');
      element = $compile(element)(scope);
      scope.$digest();
      var s = spyOn($.fn, 'offset').andCallFake(function() {
        var id = s.mostRecentCall.object.attr('id');
        return offsetMocks[id];
      });
    }));
    it('should set the default element', function () {
      var directiveScope = element.isolateScope();
      expect(directiveScope.currentElement.id).toBe('a');
    });
    it('should set the focused element', function () {
      element.find('a#e').triggerHandler('focus');
      var directiveScope = element.isolateScope();
      expect(directiveScope.currentElement.id).toBe('e');
    });
    it('should set the selected element in the controller scope', function () {
      element.find('a#e').triggerHandler('focus');
      scope.$digest();
      expect(scope.selected).toBe('e');
    });
    it('should set the left element', function () {
      element.find('a#e').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 37});
      scope.$digest();
      expect(scope.selected).toBe('d');
    });
    it('should set the right element', function () {
      element.find('a#e').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 39});
      scope.$digest();
      expect(scope.selected).toBe('f');
    });
    it('should set the top element', function () {
      element.find('a#e').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 38});
      scope.$digest();
      expect(scope.selected).toBe('b');
    });
    it('should set the bottom element', function () {
      element.find('a#e').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 40});
      scope.$digest();
      expect(scope.selected).toBe('h');
    });
  });
  describe('Cycling by default', function(){
    beforeEach(inject(function($compile) {
      element = angular.element(
        '<div em-key-navigation-container em-key-navigation-selected="selected">' +
        '<a href="#" em-key-navigation="\'a\'" id="a">a</a>' +
        '<a href="#" em-key-navigation="\'b\'" id="b">b</a>' +
        '<a href="#" em-key-navigation="\'c\'" id="c">c</a>' +
        '<br/>' +
        '<a href="#" em-key-navigation="\'d\'" id="d">d</a>' +
        '<a href="#" em-key-navigation="\'e\'" id="e">e</a>' +
        '<a href="#" em-key-navigation="\'f\'" id="f">f</a>' +
        '<br/>' +
        '<a href="#" em-key-navigation="\'g\'" id="g">g</a>' +
        '<a href="#" em-key-navigation="\'h\'" id="h">h</a>' +
        '<a href="#" em-key-navigation="\'i\'" id="i">i</a>' +
        '</div>');
      element = $compile(element)(scope);
      scope.$digest();
      var s = spyOn($.fn, 'offset').andCallFake(function() {
        var id = s.mostRecentCall.object.attr('id');
        return offsetMocks[id];
      });
    }));
    it('should not cycle horizontally', function () {
      element.find('a#f').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 39});
      scope.$digest();
      expect(scope.selected).toBe('f');
    });
    it('should not cycle vertically', function () {
      element.find('a#b').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 38});
      scope.$digest();
      expect(scope.selected).toBe('b');
    });
  });
  describe('Cycling on', function(){
    beforeEach(inject(function($compile) {
      element = angular.element(
        '<div em-key-navigation-container="{cycle: true, strictVertical: true, strictHorizontal: true}" em-key-navigation-selected="selected">' +
        '<a href="#" em-key-navigation="\'a\'" id="a">a</a>' +
        '<a href="#" em-key-navigation="\'b\'" id="b">b</a>' +
        '<a href="#" em-key-navigation="\'c\'" id="c">c</a>' +
        '<br/>' +
        '<a href="#" em-key-navigation="\'d\'" id="d">d</a>' +
        '<a href="#" em-key-navigation="\'e\'" id="e">e</a>' +
        '<a href="#" em-key-navigation="\'f\'" id="f">f</a>' +
        '<br/>' +
        '<a href="#" em-key-navigation="\'g\'" id="g">g</a>' +
        '<a href="#" em-key-navigation="\'h\'" id="h">h</a>' +
        '<a href="#" em-key-navigation="\'i\'" id="i">i</a>' +
        '</div>');
      element = $compile(element)(scope);
      scope.$digest();
      var s = spyOn($.fn, 'offset').andCallFake(function() {
        var id = s.mostRecentCall.object.attr('id');
        return offsetMocks[id];
      });
    }));
    it('should cycle horizontally', function () {
      element.find('a#f').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 39});
      scope.$digest();
      expect(scope.selected).toBe('d');
    });
    it('should cycle vertically', function () {
      element.find('a#b').triggerHandler('focus');
      element.triggerHandler({type: 'keydown', keyCode: 38});
      scope.$digest();
      expect(scope.selected).toBe('h');
    });
  });
  describe('Mouse events', function () {
    it('should not be followed', inject(function($compile){
      element = angular.element(
        '<div em-key-navigation-container em-key-navigation-selected="selected">' +
        '<a href="#" em-key-navigation="\'e\'" id="e">e</a>' +
        '<a href="#" em-key-navigation="\'f\'" id="f">f</a>' +
        '</div>');
      element = $compile(element)(scope);
      scope.$digest();
      var s = spyOn($.fn, 'offset').andCallFake(function() {
        var id = s.mostRecentCall.object.attr('id');
        return offsetMocks[id];
      });
      element.find('a#e').triggerHandler('focus');
      element.find('a#f').triggerHandler('mouseover');
      scope.$digest();
      expect(scope.selected).toBe('e');
    }));
    it('should be followed', inject(function($compile){
      element = angular.element(
        '<div em-key-navigation-container="{followMouse: true}" em-key-navigation-selected="selected">' +
        '<a href="#" em-key-navigation="\'e\'" id="e">e</a>' +
        '<a href="#" em-key-navigation="\'f\'" id="f">f</a>' +
        '</div>');
      element = $compile(element)(scope);
      scope.$digest();
      var s = spyOn($.fn, 'offset').andCallFake(function() {
        var id = s.mostRecentCall.object.attr('id');
        return offsetMocks[id];
      });
      element.find('a#e').triggerHandler('focus');
      element.find('a#f').triggerHandler('mouseover');
      scope.$digest();
      expect(scope.selected).toBe('f');
    }));
  });
  describe('Overrides', function(){
    describe('Navigation', function(){

    });
    describe('Keys', function(){

    });

  });


});
