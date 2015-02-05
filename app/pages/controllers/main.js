'use strict';

/**
 * @ngdoc function
 * @name tbsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tbsApp
 */
angular.module('tbsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
