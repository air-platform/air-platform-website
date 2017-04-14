/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('transController', transController);

    /** @ngInject */
    function transController($scope, iotUtil, NetworkService, transUtilsService) {
        var controller = this;
        controller.schedules = {}
        controller.mapPoints = {}

        //// wait for backend
        // NetworkService.get("url", {}, function getMapMakers(res) {
        //   var pointsStr = res;
        //   controller.mapPoints = transUtilsService.extractPoints(pointsStr);
        // }, null);
        var response = "徐闻,110.198611,20.2761111;海航大厦,110.35105,20.024108;" +
          "徐闻,110.198611,20.2761111;海口港,110.162196,20.046835;" +
          "徐闻,110.198611,20.2761111;美兰,110.468596,19.944221;11,110.340278,20.1000";

        controller.schedules = [
          {
            'date': '2017-04-30',
            'time': '08:00 - 09:00',
            'departure': '徐闻',
            'arrival': '海口美兰机场',
            'flight': '首都航空B-7186'
          }, {
            'date': '2017-06-03',
            'time': '14:30 - 15:30',
            'departure': '徐闻',
            'arrival': '海航大厦',
            'flight': '海南航空B-7898'
          }
        ]

        controller.mapPoints = transUtilsService.extractPoints(response);
        transUtilsService.drawMap("air-taxi-map", controller.mapPoints);

        $scope.$watch(
          function() {
            return controller.mapPoints;
          },
          function(newValue, oldValue) {
            if( newValue != oldValue ) {
              transUtilsService.drawMap("air-taxi-map", controller.mapPoints);
            }
          }
        );

    }

})();
