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
              tip: '@tooltip',
              direction: '@tooltipDirection',
              tooltipHide: '=?',
              width: '=?'
            },
            link: function(scope, elem, attr) {

              if (scope.tooltipHide) {
                return;
              }

              var tooltip;
              var appendToSelector = attrs.tooltipAppendTo || 'body';
              var topOffset = angular.element(appendToSelector).offset().top;
              var timer = null;
              var horizontalOffset = 35;
              var verticalOffset = 20;
              var createTooltip = function() {
                var tipClass = scope.direction ? 'tip-' + scope.direction : 'tip-left html-tooltip';
                var style = scope.width ? 'style="max-width:' + scope.width + 'px" ' : '';
                tooltip = angular.element('<div '+ style +'class="' + tipClass + '"></div>');

                tooltip.appendTo(appendToSelector);
                tooltip.append('<div class="tip"></div>');
                tooltip.append('<div class="content"></div>');
                tooltip.find('.content').append($compile(scope.tip)(scope));
              };

              createTooltip();

              var positionTooltip = function() {
                var offset = element.offset();
                switch (scope.direction) {
                  case 'left':
                    tooltip.css({
                      left: offset.left - tooltip.outerWidth() - horizontalOffset + 'px',
                      top: offset.top - (tooltip.outerHeight() / 2) + (element.outerHeight() / 2) + 'px',
                    });
                    break;
                  case 'right':
                    tooltip.css({
                      left: offset.left + element.outerWidth() + horizontalOffset + 'px',
                      top: offset.top - (tooltip.outerHeight() / 2) + (element.outerHeight() / 2) - topOffset + 'px',
                    });
                    break;
                  case 'top':
                    tooltip.css({
                      left: offset.left + (element.outerWidth() / 2) - (tooltip.outerWidth() / 2) + 'px',
                      top: offset.top - tooltip.outerHeight() - verticalOffset + 'px',
                    });
                    break;
                  case 'bottom':
                    tooltip.css({
                      left: offset.left + (element.outerWidth() / 2) - (tooltip.outerWidth() / 2) + 'px',
                      top: offset.top + element.outerHeight() + verticalOffset + 'px',
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
                tooltip.addClass('display');
              };

              var hideTooltip = function() {
                timer = $timeout(function() {
                  tooltip.removeClass('display');
                }, 500);
              };

              var alwaysOnTop = !_.isUndefined(attrs.tooltipAlwaysOn);

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
                tooltip.on('mouseover', showTooltip);
                tooltip.on('mouseout', hideTooltip);
                element.on('mouseover', showTooltip);
                element.on('mouseout', hideTooltip);
                element.on('mousemove', positionTooltip);
              }
        		}
        }
    }]);

    return moduleName;
}));
