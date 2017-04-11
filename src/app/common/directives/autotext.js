(function() {
  'use strict';

  angular.module('airsc').directive('autoText', autoText);

  function autoText() {
    return {
      restrict: 'A',
      link: function($scope, element) {
        console.log(element);
        var scrollIndex = 0;
        var Timer = null;
        clearInterval(Timer);
        var ul = element;
        var li = ul.children("li");
        var h = li.height();
        var index = 0;
        ul.css("height", h * li.length * 2);
        ul.html(ul.html() + ul.html());

        function run() {
          if (scrollIndex >= li.length) {
            ul.css({ top: 0 });
            scrollIndex = 1;
            ul.animate({ top: -scrollIndex * h }, 200);
          } else {
            scrollIndex++;

            ul.animate({ top: -scrollIndex * h }, 200);
          }
        }
        var Timer = setInterval(run, 1500);
      }
    }
  }
})();
