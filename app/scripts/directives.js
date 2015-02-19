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
    })
    .directive('ioImageSlider', function () {
      return {
        restrict: 'E',
        template: '<div class="io-image-slider" ng-transclude></div>',
        replace: true,
        transclude: true,
        link: function (scope, element) {
          var images = element.find('img'),
            numImages = images.length,
            current = 0;
        }
      };
    })
    .directive('ioPreload', ['Preloader', function (Preloader) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          var preloadedElements = element[0].querySelectorAll('[io-preloaded]'),
            numPreloadedElements = preloadedElements.length,
            preloader = new Preloader(numPreloadedElements);
          
          function preloadElement(elt) {
            var source = elt.getAttribute('data-src');
            preloader.loadSource(source).then(function (loadedSource) {
              elt.setAttribute('src', loadedSource);
            });
          }
          
          function preload() {
            angular.forEach(preloadedElements, preloadElement);
          }
        }
      };
    }])
    .directive('ioCover', ['$window', function ($window) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          var elementNode = element[0],
            parentNode = elementNode.parentNode,
            elementHeight,
            elementWidth,
            elementRatio;
          
          function cover() {
            var parentWidth = parentNode.offsetWidth,
              parentHeight = parentNode.offsetHeight,
              parentRatio = parentWidth / parentHeight,
              width,
              height;
            console.log(parentNode);
            if (elementRatio >= parentRatio) {
              height = parentHeight;
              width = height * elementRatio;
              elementNode.style.marginLeft = (parentWidth - width) / 2 + 'px';
            } else {
              width = parentWidth;
              height = width / elementRatio;
              elementNode.style.marginTop = (parentHeight - height) / 2 + 'px';
            }
            console.log(elementRatio, parentRatio);
            elementNode.style.width = width + 'px';
            elementNode.style.height = height + 'px';
          }
          
          function init() {
            elementHeight = elementNode.naturalHeight;
            elementWidth = elementNode.naturalWidth;
            elementRatio = elementWidth / elementHeight;
            cover();
            
            $window.addEventListener('resize', cover);
          }
          
          element.bind('load', init);
        }
      };
    }]);
}());