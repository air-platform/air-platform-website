/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('airtaxiDetailsController', airtaxiDetailsController);

    /** @ngInject */
    function airtaxiDetailsController($scope,iotUtil,transUtilsService,NetworkService) {
        /* jshint validthis: true */
        var vm = this;

        var drawMap = function(target, points) {
            var map = new BMap.Map(target);
            map.disableDragging();
            map.disableScrollWheelZoom();
            map.disableDoubleClickZoom();
            map.disablePinchToZoom();
            _.each(points, function(pt) {
              var marker = new BMap.Marker(new BMap.Point(pt[1], pt[2]));
              var label = new BMap.Label(pt[0]);
              label.setOffset(new BMap.Size(15, -15));
              marker.setLabel(label);
              marker.disableDragging();
              map.addOverlay(marker);
            });
            var markers = _.map(points, function(pt){
              return new BMap.Point(pt[1], pt[2]);
            });
            map.setViewport(markers);
            //创建弧线对象
            var curve = new BMapLib.CurveLine(markers, {
                strokeColor: "red",
                strokeWeight: 3,
                strokeOpacity: 0.5
            });
            map.addOverlay(curve);
        }
        var init = function() {
          mainView.pageData = mainView.pageData || {};
          vm.site = mainView.pageData.site;
          vm.mapPoints = transUtilsService.extractPoints(vm.site.tourPoint);
          vm.city = mainView.pageData.city;
          angular.element(".navbar-inner .topbar-with-icon").text(vm.city);
          drawMap("airtaxi-details-map-view", vm.mapPoints);
        }
        init();
    }

})();
