'use strict';

describe('Directive: emKeyNavigation', function () {

  // load the directive's module
  beforeEach(module('ngKeyNavigationApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<em-key-navigation></em-key-navigation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the emKeyNavigation directive');
  }));
});
