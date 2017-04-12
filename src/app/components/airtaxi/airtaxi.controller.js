/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('taxiController', taxiController);

    /** @ngInject */
    function taxiController($scope, iotUtil, NetworkService, AirTaxiUtilsService) {
        var controller = this;
        controller.schedules = {}
        controller.mapPoints = {}

        //// wait for backend
        // NetworkService.get("url", {}, function getMapMakers(res) {
        //   var pointsStr = res;
        //   controller.mapPoints = AirTaxiUtilsService.extractPoints(pointsStr);
        // }, null);
        var response = "徐闻,110.198611,20.2761111;海航大厦,110.35105,20.024108;" +
          "徐闻,110.198611,20.2761111;海口港,110.162196,20.046835;" +
          "徐闻,110.198611,20.2761111;美兰,110.468596,19.944221;11,110.340278,20.1000";

        controller.mapPoints = AirTaxiUtilsService.extractPoints(response);
        AirTaxiUtilsService.drawMap("air-taxi-map", controller.mapPoints);

        $scope.$watch(
          function() {
            return controller.mapPoints;
          },
          function(newValue, oldValue) {
            if( newValue != oldValue ) {
              AirTaxiUtilsService.drawMap("air-taxi-map", controller.mapPoints);
            }
          }
        );

    }

})();
