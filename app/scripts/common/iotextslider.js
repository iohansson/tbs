/*global angular, Velocity, Event*/
(function () {
  'use strict';
  
  angular.module('ioTextSlider', ['ngAnimate'])
  
    .directive('ioTextSlider', ['$location', '$window', function ($location, $window) {
      return {
        restrict: 'E',
        template: '<div class="io-text-slider" ng-transclude></div>',
        transclude: true,
        replace: true,
        scope: {
          options: '='
        },
        controller: ['$scope', function ($scope) {
          var textBlocks = [],
            numTextBlocks = 0,
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
              control.hide().then(control.show);
            }
          }
          
          function triggerResize() {
            if (options.triggerResizeOnSwitch) {
              $window.dispatchEvent(createEvent('resize'));
            }
          }
          
          function showTextBlock(textBlockIndex) {
            $scope.$emit('iotextslider.startshow', { index: textBlockIndex });
            return textBlocks[textBlockIndex].show();
          }
          
          function hideTextBlock(textBlockIndex) {
            $scope.$emit('iotextslider.starthide', { index: textBlockIndex });
            return textBlocks[textBlockIndex].hide();
          }
          
          function afterHideActions(textBlockIndex) {
            triggerResize();
            $scope.$emit('iotextslider.endhide', { index: textBlockIndex });
          }
          
          function afterShowActions(textBlockIndex) {
            $scope.$emit('iotextslider.endshow', { index: textBlockIndex });
          }
          
          function nextTextBlock() {
            hideTextBlock(current).then(function () {
              afterHideActions(current);
              current += 1;
              showTextBlock(current).then(function () {
                afterShowActions(current);
              });
            });
          }
          
          function afterAction() {
            if ($scope.options.url) {
              $location.path(options.url);
            }
          }
          
          this.addTextBlock = function (textBlock) {
            textBlocks.push(textBlock);
            numTextBlocks += 1;
            if (numTextBlocks === 1) {
              showTextBlock(current);
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
            return current < numTextBlocks - 1;
          };
          
          $scope.hasPrev = function () {
            return current > 0;
          };
          
          this.showNext = function () {
            if ($scope.hasNext()) {
              nextTextBlock();
              animateControl();
            } else {
              afterAction();
            }
          };
          
          function showControl() {
            control.show();
          }
          
          function listenForEvents() {
            $scope.$on('iotextslider.hidecontrol', function () {
              hideControl();
            });
            
            $scope.$on('iotextslider.showcontrol', function () {
              showControl();
            });
          }
          
          listenForEvents();
        }]
      };
    }])
  
    .directive('ioTextBlock', ['$q', '$animate', function ($q, $animate) {
      return {
        restrict: 'E',
        template: '<div class="io-text-block io-text-slider-hide" ng-transclude></div>',
        transclude: true,
        replace: true,
        require: '^ioTextSlider',
        scope: {},
        link: function (scope, element, attrs, ctrl) {
          var elementNode = element[0],
            parent = element.parent();
          
          function connectToController() {
            ctrl.addTextBlock(scope);
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
            var delay = $q.defer();
            $animate.addClass(element, 'io-text-slider-hide', function () {
              delay.resolve();
            });
            
            return delay.promise;
          };
          
          scope.show = function () {
            var delay = $q.defer();
            $animate.removeClass(element, 'io-text-slider-hide', function () {
              delay.resolve();
            });
            
            return delay.promise;
          };
          
          init();
        }
      };
    }])
  
    .directive('ioTextSliderControl', ['$q', '$animate', function ($q, $animate) {
      return {
        restirct: 'A',
        require: '^ioTextSlider',
        link: function (scope, element, attrs, ctrl) {
          var parent = element.parent();
          
          scope.hide = function () {
            var delay = $q.defer();
            $animate.addClass(element, 'io-text-slider-hide', function () {
              delay.resolve();
            });
            
            return delay.promise;
          };
          
          scope.show = function () {
            var delay = $q.defer();
            $animate.removeClass(element, 'io-text-slider-hide', function () {
              delay.resolve();
            });
            
            return delay.promise;
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