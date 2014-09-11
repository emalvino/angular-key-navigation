'use strict';

angular
  .module('ngKeyNavigationApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'emKeyNavigation'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
