(function() {
  'use strict';

  //mapUtilsService
  angular.module('airsc')
    .factory('mapUtilsService', mapUtilsService);

  //TODO: to find a better way
  if (!window.markedOverlays) window.markedOverlays = [];
  if (!window.mapDrawPointRoutes) window.mapDrawPointRoutes = [];

  function mapUtilsService(MapService) {
    var extractPoints = function(pointsStr) {
      var points = pointsStr.trim().replace(/\;$/, '').split(";")
      var allPoints = _.map(points, function(s) {
        var a = s.split(",");
        return [a[0], parseFloat(a[1]), parseFloat(a[2])];
      });
      return allPoints;
    };

    var drawMap = function(target, points, config) {
      // MapService.mapPromise().then(function () {
        if (!config) config = {};
        // 百度地图API功能
        var map = new BMap.Map(target);
        map.disableDragging();
        map.disableScrollWheelZoom();
        map.disableDoubleClickZoom();
        map.disablePinchToZoom();
        var routes = parseSingleRoutes(points); // return array of arrays
        window.mapDrawPointRoutes = routes;
        var markerPoints = parseMarkers(points); // return array of BMap.Point
        map.setViewport(markerPoints);

        if (config.markers) { // add point markers
          addMarkers(markerPoints);
        }
        if (config.curves) { // draw curve routes
          drawCurves(map, routes);
        }

        function parseSingleRoutes(points) {
          var routes = [];
          for (var i = 0; i < points.length; i += 2) {
            var route = [points[i], points[i + 1]];
            if (_.find(routes, function (r) {
                return _.isEqual(r, route) || _.isEqual(r, [route[1], route[0]])
              }) == null) {
              routes.push(route);
            }
          }
          return routes;
        }

        function addMarkers(markerPoints) {
          _.each(markerPoints, function (pt) {
            var icon = new BMap.Icon("assets/images/airtaxi/map-marker.svg",
              new BMap.Size(20, 30));
            var marker = new BMap.Marker(pt, {icon: icon});
            // var label = new BMap.Label(pt[2], {
            //     offset: new BMap.Size(40, 20)
            // });
            // label.setStyle({
            //   color : "#50bbff",
            //   fontSize : "14px",
            //   backgroundColor :"0.3",
            //   border :"0",
            // });
            marker.setOffset(new BMap.Size(0, -20));
            marker.setZIndex(100);
            // marker.setLabel(label);
            map.addOverlay(marker);
            marker.addEventListener("click", function (e) {
              var point = e.currentTarget.point;
            });
          });
        }

        function addClickHandler(curve) {
          curve.addEventListener("click", function (e) {
            while (window.markedOverlays.length > 0) map.removeOverlay(window.markedOverlays.pop());
            window.markedOverlays.push(selectRouting(e.target));
            window.markedOverlays.push(addCurveMarker(map, e.target));
            $('body').trigger("airtrans.selectRoute", e.target);
          });
        }

        function selectRouting(target) {
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

        return map;
      // })
    };

    function drawCurves(map, routes) {
      for (var i = 0; i < routes.length; i++) {
        var pt1 = new BMap.Point(routes[i][0][1], routes[i][0][2]);
        var pt2 = new BMap.Point(routes[i][1][1], routes[i][1][2]);
        var route = pt1.lng<pt2.lng?[pt1, pt2]:[pt2, pt1];
        var curve = new BMapLib.CurveLine(route, {
          strokeColor: "gray",
          strokeWeight: 5,
          strokeOpacity: 0.5
        });
        var content = routes[i][0][0];
        map.addOverlay(curve);
        // addClickHandler(curve, i);
      }
    }

    function parseMarkers(points) {
      var locs = [];
      for (var i = 0; i < points.length; i++) {
        if(_.find(locs, function(pt) { return _.isEqual(pt, points[i]); }) == null) {
          locs.push(points[i]);
        }
      }
      return _.map(locs, function(loc){
        return new BMap.Point(loc[1], loc[2]);
      });
    }

    function getOverlayOffset(pointA, pointB) {
      var delta = 0.07
      var center = [(pointA[0] + pointB[0]) / 2.0, (pointA[1] + pointB[1]) / 2.0];
      if (Math.abs(pointB[1] - pointA[1]) < 0.000001) return [center[0], center[1] + delta];
      if (Math.abs(pointB[0] - pointA[0]) < 0.000001) return [center[0] + delta, center[1]];
      var r = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]);
      return [center[0] + delta, center[1] - delta / r];
    }

    var markCurve = function(map, points) {
      var pt1 = new BMap.Point(points[0][1], points[0][2]);
      var pt2 = new BMap.Point(points[1][1], points[1][2]);
      var route = pt1.lng<pt2.lng?[pt1, pt2]:[pt2, pt1];
      var curve = new BMapLib.CurveLine(route, {
        strokeColor: "red",
        strokeWeight: 5,
        strokeOpacity: 0.5
      });
      map.addOverlay(curve);
      var icon = addCurveMarker(map, curve);
      window.markedOverlays.push(curve);
      window.markedOverlays.push(icon);
    };

    var addCurveMarker = function(map, target) {
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

    var removeMarkedCurve = function(map) {
      // TODO: Baidu map bug?: delete all overlays
      var curves = _.filter(map.getOverlays(), function(overlay) {
        return !!overlay.cornerPoints;
      });
      while (window.markedOverlays.length > 0)
        map.removeOverlay(window.markedOverlays.pop());
      while(curves.length > 0) map.removeOverlay(curves.pop());
      drawCurves(map, window.mapDrawPointRoutes);
    }
    return {
      'drawMap': drawMap,
      'markCurve': markCurve,
      'removeMarkedCurve': removeMarkedCurve,
      'extractPoints': extractPoints
    };
  }
})();
