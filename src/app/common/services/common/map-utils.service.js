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

    var drawMap = function(target, points, config,callback) {


      // MapService.mapPromise().then(function () {
        if (!config) config = {};
        // 百度地图API功能
        var map = new BMap.Map(target);


        // map.disableDragging();
        // map.disableScrollWheelZoom();
        // map.disableDoubleClickZoom();
        // map.disablePinchToZoom();
        var routes = parseSingleRoutes(points); // return array of arrays
        window.mapDrawPointRoutes = routes;
        var markerPoints = parseMarkers(points); // return array of ["label", BMap.Point]
        map.setViewport(_.map(markerPoints, function(p) { return p[1]; }));

        if (config.markers) { // add point markers
          addMarkers(markerPoints, { 'labelType': config.labels });
        }
        if (config.curves) { // draw curve routes
          drawCurves(map, routes);
        }

        if (callback && typeof(callback) === "function") {
            callback(map);
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

        function addMarkers(markerPoints, config) {
          map.getOverlays;
          _.each(markerPoints, function(pt) {
            var icon = new BMap.Icon("assets/images/airtaxi/map-marker.svg",
              new BMap.Size(20, 30));
            var marker = new BMap.Marker(pt[1], {icon: icon});
            if(config.labelType == 'static' ) {
              var label = new BMap.Label(pt[0], {
                  offset: new BMap.Size(20, 5)
              });
              label.setStyle({
                fontSize : "12px",
                height: "18px"
              });
              marker.setLabel(label);
            }
            if(config.labelType == 'onclick') {
              marker.addEventListener('click', function(e) {
                var markers = _.each(map.getOverlays(), function(overlay) {
                  if(overlay instanceof BMap.Marker) {
                    var label = overlay.getLabel();
                    if(label) label.remove();
                  }
                });
                if(marker.getLabel() == null) {
                  var label = new BMap.Label(pt[0], {
                      offset: new BMap.Size(20, 5)
                  });
                  label.setStyle({
                    fontSize : "12px",
                    height: "18px"
                  });
                  marker.setLabel(label);
                }
              });
            }
            marker.setOffset(new BMap.Size(0, -20));
            marker.setZIndex(100);
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
        return [loc[0], new BMap.Point(loc[1], loc[2])];
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

    var removeMarkedCurve = function(map, withCurves) {
      // TODO: Baidu map bug?: delete all overlays
      var curves = _.filter(map.getOverlays(), function(overlay) {
        return !!overlay.cornerPoints;
      });
      while (window.markedOverlays.length > 0)
        map.removeOverlay(window.markedOverlays.pop());
      while(curves.length > 0) map.removeOverlay(curves.pop());
      if(withCurves) drawCurves(map, window.mapDrawPointRoutes);
    }


    var drawFakePoints = function(map){

        var fakePoints = '海口市西海岸会所,110.2263889,20.03611111;' +
            '海口国兴大道海航广场,110.3402778,20.03611111;' +
            '三亚市南山寺,109.2088889,18.29638889;' +
            '三亚市亚太国际会议中心,109.3883333,18.290000;' +
            '三亚市海棠湾,109.7377778,18.35194444;' +
            '万宁市兴隆康乐园,110.2252778,18.76055556;' +
            '陵水YOHO湾,110.0461111,18.54583333;' +
            '琼海市博鳌男爵公馆,110.5933333,19.16416667;' +
            '海口市新国宾酒店,110.2144444,20.0525;' +
            '海南市南海明珠,110.1894444,20.06611111;' +
            '海口美兰机场,110.468596,19.944221;' +
            '五指山风景区,109.6777778,18.90916667;' +
            '临高县临高角,109.7097222,20.00388889;' +
            '乐东县莺歌海,108.6958333,18.51472222;' +
            '东方市八所,108.62,19.09444444;' +
            '保亭神玉文化中心,109.5786111,18.65472222;' +
            '文县市铺前港,110.5755556,20.02416667;' +
            '屯昌县木色湖,109.9811111,19.20388889;' +
            '东方通用机场,108.68,19.13305556;' +
            '珠海直三亚基地,109.4316667,18.30527778;' +
            '三亚市海航旅游学院,109.4316667,18.29361111;' +
            '三亚市凯宾斯基酒店,109.7372222,18.32861111;' +
            '三亚市万豪酒店,109.6375,18.23194444;' +
            '三亚市丽思卡尔顿酒店,109.6327778,18.23027778;' +
            '三亚市红树林酒店,109.7338889,18.34111111;' +
            '三亚市凤凰岛度假酒店,109.4991667,18.24666667;' +
            '三亚市鹿回头洲际酒店,109.4961111,18.21277778;' +
            '三亚市西岛,109.3622222,18.22916667;' +
            '博鳌市男爵公馆,110.4536111,19.13916667;' +
            '三亚市大小洞天,109.1483333,18.30916667;' +
            '三亚市香格里拉酒店,109.7472222,18.35777778;';
      // var routes = parseSingleRoutes(fakePoints); // return array of arrays
      // window.mapDrawPointRoutes = routes;
      var markerPoints = parseMarkers(parseMapPoints(fakePoints)); // return array of ["label", BMap.Point]
      map.setViewport(_.map(markerPoints, function(p) { return p[1]; }));

      addMarkers(markerPoints, { 'labelType': 'onclick'});

        function parseMapPoints(fakePoints) {
            var points = [];
            var loc = fakePoints.split(';');
            for (var i=0; i< loc.length;i++){
                var point = loc[i].split(',');
                points.push([point[0],point[1],point[2]]);
            }
            return points;
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

      function addMarkers(markerPoints, config) {
        _.each(markerPoints, function(pt) {
          var icon = new BMap.Icon("assets/images/airtaxi/map-marker.svg",
              new BMap.Size(20, 30));
          var marker = new BMap.Marker(pt[1], {icon: icon});
          if(config.labelType == 'static' ) {
            var label = new BMap.Label(pt[0], {
              offset: new BMap.Size(20, 5)
            });
            label.setStyle({
              fontSize : "12px",
              height: "18px"
            });
            marker.setLabel(label);
          }
          if(config.labelType == 'onclick') {
            marker.addEventListener('click', function(e) {
              var markers = _.each(map.getOverlays(), function(overlay) {
                if(overlay instanceof BMap.Marker) {
                  var label = overlay.getLabel();
                  if(label) label.remove();
                }
              });
              if(marker.getLabel() == null) {
                var label = new BMap.Label(pt[0], {
                  offset: new BMap.Size(20, 5)
                });
                label.setStyle({
                  fontSize : "12px",
                  height: "18px"
                });
                marker.setLabel(label);
              }
            });
          }
          marker.setOffset(new BMap.Size(0, -20));
          marker.setZIndex(100);
          map.addOverlay(marker);
          marker.addEventListener("click", function (e) {
            var point = e.currentTarget.point;
          });
        });
      }
    }

    return {
      'drawMap': drawMap,
      'markCurve': markCurve,
      'removeMarkedCurve': removeMarkedCurve,
      'extractPoints': extractPoints,
      'drawFakePoints':drawFakePoints
    };
  }
})();
