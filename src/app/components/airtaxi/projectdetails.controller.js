/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('airtaxiDetailsController', airtaxiDetailsController);

    /** @ngInject */
    function airtaxiDetailsController($scope,iotUtil,transUtilsService) {
        /* jshint validthis: true */
        var vm = this;

        var response = "徐闻,110.198611,20.2761111;海航大厦,110.35105,20.024108;" +
          "徐闻,110.198611,20.2761111;海口港,110.162196,20.046835;" +
          "徐闻,110.198611,20.2761111;美兰,110.468596,19.944221;11,110.340278,20.1000";
        vm.mapPoints = transUtilsService.extractPoints(response);
        var points = [
            [110.279189, 25.316421, "芦笛岩"],
            [110.2752778, 25.28333333, "西山公园"],
            [110.2933333, 25.27388889, "象山公园"],
            [110.305, 25.27611111, "七星景区"],
            [110.3011111, 25.27, "訾洲公园"],
            [110.3041667, 25.28277778, "伏波山公园"],
            [110.3013889, 25.29888889, "虞山公园"]
        ];
        var drawMap = function(target, points) {
            var map = new BMap.Map(target); // 创建Map实例
            // map.centerAndZoom(new BMap.Point(110.3041667,25.28277778),14);  // 初始化地图,用城市名设置地图中心点
            map.disableDragging();
            map.disableScrollWheelZoom();
            map.disableDoubleClickZoom();
            map.disablePinchToZoom();
            for (var i = points.length - 1; i >= 0; i--) {
                var marker = new BMap.Marker(new BMap.Point(points[i][0], points[i][1]));
                var content = points[i][2];
                var label = new BMap.Label(content, {
                    offset: new BMap.Size(15, -15)
                });
                map.addOverlay(marker);
                marker.setLabel(label);
                marker.disableDragging();
            }
            var markers = [];
            for (var i = 0; i < points.length; i++) {
                var point = new BMap.Point(points[i][0], points[i][1]);
                markers.push(point);
            }
            map.setViewport(markers);
            var curve = new BMapLib.CurveLine(markers, {
                strokeColor: "red",
                strokeWeight: 3,
                strokeOpacity: 0.5
            }); //创建弧线对象
            map.addOverlay(curve);
        }

        drawMap("airtaxi-details-map-view", points);
    }

})();
