/*global angular, Velocity, Event*/
(function () {
  'use strict';
  
  angular.module('ioSlider', ['ngAnimate'])
  
    .directive('ioSlider', ['$location', '$window', function ($location, $window) {
      return {
        restrict: 'E',
        template: '<div class="io-slider" ng-transclude></div>',
        transclude: true,
        replace: true,
        scope: {
          options: '='
        },
        controller: ['$scope', function ($scope) {
          var slides = [],
            numSlides = 0,
            control,
            current = 0,
            defaultOptions = {
              animateControlOnSwitch: true,
              triggerResizeOnSwitch: true,
              hideControlOnLink: false
            },
            options = angular.extend(defaultOptions, $scope.options);
          
          /* refactor to a service please */
          function createEvent(eventName) {
            var newEvent;
            if (document.createEvent) {
              newEvent = document.createEvent('Event');
              newEvent.initEvent(eventName, false, false);
            } else {
              newEvent = new Event(eventName);
            }
            
            return newEvent;
          }
          
          function animateControl() {
            if (options.animateControlOnSwitch) {
              control.hide().then(function () {
                control.show().then(function () {
                  console.log('control shown');
                });
              });
            }
          }
          
          function triggerResize() {
            if (options.triggerResizeOnSwitch) {
              $window.dispatchEvent(createEvent('resize'));
            }
          }
          
          function showSlide(slideIndex) {
            $scope.$emit('ioslider.startshow', { index: slideIndex });
            return slides[slideIndex].show();
          }
          
          function hideSlide(slideIndex) {
            $scope.$emit('ioslider.starthide', { index: slideIndex });
            return slides[slideIndex].hide();
          }
          
          function afterHideActions(slideIndex) {
            triggerResize();
            $scope.$emit('ioslider.endhide', { index: slideIndex });
          }
          
          function afterShowActions(slideIndex) {
            $scope.$emit('ioslider.endshow', { index: slideIndex });
          }
          
          function nextSlide() {
            hideSlide(current).then(function () {
              afterHideActions(current);
              current += 1;
              showSlide(current).then(function () {
                console.log('shown ' + current);
                afterShowActions(current);
              });
            });
          }
          
          function afterAction() {
            if ($scope.options.url) {
              $location.path(options.url);
            }
          }
          
          this.addSlide = function (slide) {
            slides.push(slide);
            numSlides += 1;
            if (numSlides === 1) {
              showSlide(current);
            }
          };
          
          function afterControlHideActions() {
            triggerResize();
          }
          
          function hideControl() {
            control.hide().then(function () {
              afterControlHideActions();
            });
          }
          
          function hideControlOnLink() {
            if (options.hideControlOnLink) {
              hideControl();
            }
          }
          
          function afterControlLinkActions() {
            hideControlOnLink();
          }
          
          this.setControl = function (controlElement) {
            control = controlElement;
            afterControlLinkActions();
          };
          
          $scope.hasNext = function () {
            return current < numSlides - 1;
          };
          
          $scope.hasPrev = function () {
            return current > 0;
          };
          
          this.showNext = function () {
            if ($scope.hasNext()) {
              nextSlide();
              animateControl();
            } else {
              afterAction();
            }
          };
          
          function showControl() {
            control.show();
          }
          
          function listenForEvents() {
            $scope.$on('ioslider.hidecontrol', function () {
              hideControl();
            });
            
            $scope.$on('ioslider.showcontrol', function () {
              showControl();
            });
          }
          
          listenForEvents();
        }]
      };
    }])
  
    .directive('ioSlide', ['$q', '$animate', function ($q, $animate) {
      return {
        restrict: 'E',
        template: '<div class="io-slide io-slider-hide" ng-transclude></div>',
        transclude: true,
        replace: true,
        require: '^ioSlider',
        scope: {},
        link: function (scope, element, attrs, ctrl) {
          var elementNode = element[0],
            parent = element.parent();
          
          function connectToController() {
            ctrl.addSlide(scope);
          }
          
          function performAnimation(animation, completeCallback) {
            Velocity(element, animation, {
              complete: completeCallback
            });
          }
          
          function init() {
            connectToController();
          }
          
          scope.hide = function () {
            return $animate.addClass(element, 'io-slider-hide');
          };
          
          scope.show = function () {
            return $animate.removeClass(element, 'io-slider-hide');
          };
          
          init();
        }
      };
    }])
  
    .directive('ioSliderControl', ['$q', '$animate', function ($q, $animate) {
      return {
        restirct: 'A',
        require: '^ioSlider',
        link: function (scope, element, attrs, ctrl) {
          var parent = element.parent();
          
          scope.hide = function () {
            return $animate.addClass(element, 'io-slider-hide');
          };
          
          scope.show = function () {
            return $animate.removeClass(element, 'io-slider-hide');
          };
          
          scope.performAction = function () {
            ctrl.showNext();
          };
          
          function connectToController() {
            ctrl.setControl(scope);
          }
          
          function init() {
            connectToController();
          }
          
          init();
        }
      };
    }]);
}());