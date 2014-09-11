/*global $:false */
'use strict';

describe('Directive: emKeyNavigation', function () {

  // load the directive's module
  beforeEach(module('emKeyNavigation'));

  var element, scope, compileTemplate;
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
  // Utility functions
  var event = function(e, eventName){
    e.triggerHandler(eventName);
    scope.$digest();
  };
  var key = {
    execute: function(k){
      event(element,k);
    },
    left: function(){ key.execute({type: 'keydown', keyCode: 37});},
    right: function(){ key.execute({type: 'keydown', keyCode: 39});},
    up: function(){ key.execute({type: 'keydown', keyCode: 38});},
    down: function(){ key.execute({type: 'keydown', keyCode: 40});},
    a: function(){ key.execute({type: 'keydown', keyCode: 65});}
  };
  var focus = function(id){
    event(element.find('a#' + id), 'focus');
  };
  var mouseover = function(id){
    event(element.find('a#' + id), 'mouseover');
  };
  var shouldSelect = function(id){
    expect(scope.selected).toBe(id);
  };
  var getTemplate = function(options){
    return '<div em-key-navigation-container="' +
      options +
      '" em-key-navigation-selected="selected">' +
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
      '</div>';
  };
  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    compileTemplate = function(template){
      element = angular.element(template);
      element = $compile(element)(scope);
      scope.$digest();
      var s = spyOn($.fn, 'offset').andCallFake(function() {
        var id = s.mostRecentCall.object.attr('id');
        return offsetMocks[id];
      });
    };
  }));
  describe('Basic navigation', function(){
    beforeEach(function() {
      compileTemplate(getTemplate(''));
    });
    it('should set the default element', function () {
      var directiveScope = element.isolateScope();
      expect(directiveScope.currentElement.id).toBe('a');
    });
    it('should set the focused element', function () {
      focus('e');
      var directiveScope = element.isolateScope();
      expect(directiveScope.currentElement.id).toBe('e');
    });
    it('should set the selected element in the controller scope', function () {
      focus('e');
      shouldSelect('e');
    });
    it('should set the left element', function () {
      focus('e');
      key.left();
      shouldSelect('d');
    });
    it('should set the right element', function () {
      focus('e');
      key.right();
      shouldSelect('f');
    });
    it('should set the top element', function () {
      focus('e');
      key.up();
      shouldSelect('b');
    });
    it('should set the bottom element', function () {
      focus('e');
      key.down();
      shouldSelect('h');
    });
  });
  describe('Cycling by default', function(){
    beforeEach(function() {
      compileTemplate(getTemplate(''));
    });
    it('should not cycle horizontally', function () {
      focus('f');
      key.right();
      shouldSelect('f');
    });
    it('should not cycle vertically', function () {
      focus('b');
      key.up();
      shouldSelect('b');
    });
  });
  describe('Cycling on', function(){
    beforeEach(function() {
      compileTemplate(getTemplate('{cycle: true, strictVertical: true, strictHorizontal: true}'));
    });
    it('should cycle horizontally', function () {
      focus('f');
      key.right();
      shouldSelect('d');
    });
    it('should cycle vertically', function () {
      focus('b');
      key.up();
      shouldSelect('h');
    });
  });
  describe('Mouse events', function () {
    it('should not be followed', function(){
      compileTemplate(getTemplate(''));
      focus('e');
      mouseover('f');
      shouldSelect('e');
    });
    it('should be followed', function(){
      compileTemplate(getTemplate('{followMouse: true}'));
      focus('e');
      mouseover('f');
      shouldSelect('f');
    });
  });
  describe('Override', function(){
    it('should use provided navigation', function(){
      compileTemplate(getTemplate('{cycle: false, overrides: {a: {right: \'c\'}}}'));
      focus('a');
      key.right();
      shouldSelect('c');
    });
    it('should use provided keys', function(){
      compileTemplate(getTemplate('{cycle: false, keys: { left: [65] }}'));
      focus('f');
      key.a();
      shouldSelect('e');
    });
  });
});
