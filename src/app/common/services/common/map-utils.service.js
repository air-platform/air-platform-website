(function() {
    'use strict';

    //mapUtilsService
    angular.module('airsc')
        .factory('mapUtilsService', mapUtilsService);

    //TODO: to find a better way
    if (!window.markedOverlays) window.markedOverlays = [];

    function mapUtilsService() {
        var extractPoints = function(pointsStr) {
            var points = pointsStr.trim().replace(/\;$/, '').split(";")
            var allPoints = _.map(points, function(s) {
                var a = s.split(",");
                return [a[0], parseFloat(a[1]), parseFloat(a[2])];
            });
            return allPoints;
        };

        var drawMap = function(target, points, clickHandler) {
            // 百度地图API功能
            var map = new BMap.Map(target);
            map.disableDragging();
            map.disableScrollWheelZoom();
            map.disableDoubleClickZoom();
            map.disablePinchToZoom();
            var routes = [];
            var markerPoints = []
            for (var i = 0; i < points.length; i += 2) {
                var route = [points[i], points[i + 1]];
                if(_.find(routes, function(r) {
                    return _.isEqual(r, route) || _.isEqual(r, [route[1], route[0]])
                  }) == null) {
                  routes.push(route);
                }
            }
            for (var i = 0; i < routes.length; i++) {
                var pt1 = new BMap.Point(routes[i][0][1], routes[i][0][2]);
                var pt2 = new BMap.Point(routes[i][1][1], routes[i][1][2]);
                var route = pt1.lng<pt2.lng?[pt1, pt2]:[pt2, pt1];
                markerPoints.push(pt1);
                markerPoints.push(pt2);
                var curve = new BMapLib.CurveLine(route, {
                    strokeColor: "gray",
                    strokeWeight: 5,
                    strokeOpacity: 0.5
                });
                var content = routes[i][0][0];
                map.addOverlay(curve);
                addClickHandler(curve, i);
            }
            map.setViewport(markerPoints);

            function addClickHandler(curve) {
                curve.addEventListener("click", function(e) {
                    while (window.markedOverlays.length > 0) map.removeOverlay(window.markedOverlays.pop());
                    window.markedOverlays.push(selectRouting(e.target));
                    window.markedOverlays.push(addMarker(e.target));
                    $('body').trigger("airtrans.selectRoute", e.target);
                });
            }

            function selectRouting(target) {
                target.w.strokeColor = "red";
                var data = target.cornerPoints
                var points = [new BMap.Point(data[0].lng, data[0].lat),
                    new BMap.Point(data[1].lng, data[1].lat)
                ];
                var curve = new BMapLib.CurveLine(points, {
                    strokeColor: "red",
                    strokeWeight: 5,
                    strokeOpacity: 0.5
                })
                map.addOverlay(curve);
                return curve;
            }

            function getOverlayOffset(pointA, pointB) {
                var delta = 0.07
                var center = [(pointA[0] + pointB[0]) / 2.0, (pointA[1] + pointB[1]) / 2.0];
                if (Math.abs(pointB[1] - pointA[1]) < 0.000001) return [center[0], center[1] + delta];
                if (Math.abs(pointB[0] - pointA[0]) < 0.000001) return [center[0] + delta, center[1]];
                var r = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]);
                return [center[0] + delta, center[1] - delta / r];
            }

            function addMarker(target) {
                var copter = new BMap.Icon("assets/images/helicopter.png", new BMap.Size(34, 27), {
                    offset: new BMap.Size(10, 25)
                });
                var data = target.cornerPoints
                var point = getOverlayOffset([data[0].lng, data[0].lat], [data[1].lng, data[1].lat]);
                var marker = new BMap.Marker(new BMap.Point(point[0], point[1]), {
                    icon: copter
                });
                map.addOverlay(marker);
                return marker;
            }
        };

        return {
            'drawMap': drawMap,
            'extractPoints': extractPoints
        };
    }
})();
