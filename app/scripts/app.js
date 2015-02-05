/*global angular*/
(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name tbsApp
   * @description
   * # tbsApp
   *
   * Main module of the application.
   */
  angular
    .module('tbsApp', [
      'ngAnimate',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'directives',
      'ioTextSlider',
      'intro'
    ])
    .config(function ($routeProvider) {
      $routeProvider
        .otherwise({
          redirectTo: '/intro'
        });
    });
}());