(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['angular'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('angular'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.angular);
    }
}(this, function (angular) {
    var moduleName = 'vivify-ideas.angular-html-tooltips';
    var mod = angular.module(moduleName, []);
    mod.directive('viHtmlTooltip', ['$compile', '$timeout', function($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
              tip: '@viHtmlTooltip',
              direction: '@viTooltipDirection',
              viTooltipHide: '=?',
              width: '=?'
            },
            link: function(scope, element, attrs) {

              if (scope.tooltipHide) {
                return;
              }

              if (!scope.direction) {
                scope.direction = 'left';
              }

              var tooltip;
              var appendToElement = document.querySelector(attrs.tooltipAppendTo || 'body');
              var topOffset = appendToElement.offsetTop;
              var timer = null;
              var horizontalOffset = 35;
              var verticalOffset = 20;
              var createTooltip = function() {
                var tipClass = scope.direction ? 'tip-' + scope.direction : 'tip-left';
                tooltip = document.createElement('div');
                tooltip.classList.add('html-tooltip');
                tooltip.classList.add(tipClass);
                if (scope.width) {
                  tooltip.style.maxWidth = scope.width + 'px';
                }
                var tip = document.createElement('div');
                tip.classList.add('tip');
                var content = document.createElement('div');
                content.classList.add('content');
                tooltip.append(tip);
                tooltip.append(content);
                appendToElement.append(tooltip);
                content.insertAdjacentHTML('beforeend', scope.tip);
                $compile(content)(scope);
              };

              createTooltip();

              var positionTooltip = function() {
                switch (scope.direction) {
                  case 'left':
                    tooltip.css({
                      left: element.offsetLeft - tooltip.outerWidth() - horizontalOffset + 'px',
                      top: element.offsetHeight - (tooltip.outerHeight() / 2) + (element.outerHeight() / 2) + 'px',
                    });
                    break;
                  case 'right':
                    tooltip.css({
                      left: element.offsetLeft + element.outerWidth() + horizontalOffset + 'px',
                      top: element.offsetHeight - (tooltip.outerHeight() / 2) + (element.outerHeight() / 2) - topOffset + 'px',
                    });
                    break;
                  case 'top':
                    tooltip.css({
                      left: element.offsetLeft + (element.outerWidth() / 2) - (tooltip.outerWidth() / 2) + 'px',
                      top: element.offsetHeight - tooltip.outerHeight() - verticalOffset + 'px',
                    });
                    break;
                  case 'bottom':
                    tooltip.css({
                      left: element.offsetLeft + (element.outerWidth() / 2) - (tooltip.outerWidth() / 2) + 'px',
                      top: element.offsetHeight + element.outerHeight() + verticalOffset + 'px',
                    });
                    break;
                }
              };

              var showTooltip = function() {
                if (scope.tooltipHide) {
                  return;
                }
                $timeout.cancel(timer);
                positionTooltip();
                tooltip.classList.add('display');
              };

              var hideTooltip = function() {
                timer = $timeout(function() {
                  tooltip.classList.remove('display');
                }, 500);
              };

              var alwaysOnTop = "undefined" !== typeof attrs.tooltipAlwaysOn;

              if (alwaysOnTop) {
                $timeout(function() {
                  showTooltip();
                }, 500);
                window.addEventListener('resize', positionTooltip);
              }

              scope.$watch('tooltipHide', function(val) {
                if (val) {
                  tooltip.remove();
                }
              });

              scope.$watch('tip', function() {
                createTooltip();
              });

              element.on('remove', function() {
                tooltip.remove();
              });

              if (!scope.tooltipHide && !alwaysOnTop) {
                // tooltip.on('mouseover', showTooltip);
                // tooltip.on('mouseout', hideTooltip);
                element.on('mouseover', showTooltip);
                element.on('mouseout', hideTooltip);
                element.on('mousemove', positionTooltip);
              }
        		}
        }
    }]);

    return moduleName;
}));
