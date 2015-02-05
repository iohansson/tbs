/*global angular*/
(function () {
  'use strict';
  
  angular.module('directives', [])
    .directive('logo', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/logo.html',
        replace: true
      };
    })
    .directive('controls', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/controls.html',
        replace: true
      };
    })
    .directive('heart', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/heart.html',
        replace: true
      };
    })
    .directive('socialAccordeon', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/socialaccordeon.html',
        replace: true,
        scope: {},
        link: function (scope, element) {
          var list = element.find('ul'),
            icons = list.children(),
            numIcons = icons.length;
          
          function init() {
            scope.isOpen = false;
            
            scope.toggleAccordeon = function () {
              scope.isOpen = !scope.isOpen;
            };
          }
          
          init();
        }
      };
    });
}());