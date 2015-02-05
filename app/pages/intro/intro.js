/*global angular*/
(function () {
  'use strict';

  angular.module('intro', [])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/intro', {
          templateUrl: 'pages/intro/intro.html'
        });
    });
}());