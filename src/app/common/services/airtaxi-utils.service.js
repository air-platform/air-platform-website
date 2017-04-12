(function () {
    'use strict';

    //AirTaxiUtilsService
    angular.module('airsc')
        .factory('AirTaxiUtilsService', AirTaxiUtilsService);

    //TODO: to find a better way
    if ( !window.markedOverlays ) window.markedOverlays = [];

    function AirTaxiUtilsService() {
        var extractPoints = function(pointsStr) {
          var points = pointsStr.split(";")
          var allPoints = _.map(points, function(s){
            var a = s.split(",");
            return [a[0], parseFloat(a[1]), parseFloat(a[2])];
          });
          return {
            'zoom': parseInt(_.last(allPoints)[0]),
            'center': [_.last(allPoints)[1], _.last(allPoints)[2]],
            'points': allPoints.slice(0, allPoints.length-1)
          };
        };

        var drawMap = function drawMap(target, data, clickHandler) {
          // 百度地图API功能
        	var map = new BMap.Map(target);
        	map.centerAndZoom(new BMap.Point(data.center[0], data.center[1]), data.zoom);
        	map.disableDoubleClickZoom();
        	map.disableInertialDragging();

          var points = data.points
        	for(var i=0;i<points.length;i+=2){
        		var pts = [new BMap.Point(points[i][1], points[i][2]),
        				new BMap.Point(points[i+1][1], points[i+1][2])];
        		var curve = new BMapLib.CurveLine(pts,{strokeColor:"gray", strokeWeight:5, strokeOpacity:0.5});
        		var content = points[i][0];
        		//curve加上content
        		map.addOverlay(curve);
        		addClickHandler(content,curve,i);
        	}

        	function addClickHandler(content,curve){
          		curve.addEventListener("click",function(e){
                while( window.markedOverlays.length > 0 ) map.removeOverlay(window.markedOverlays.pop());
                window.markedOverlays.push(selectRouting(e.target));
                window.markedOverlays.push(addMarker(e.target));
              }
        		);
        	}

          function selectRouting(target) {
            target.w.strokeColor = "red";
            var data = target.cornerPoints
            var points = [new BMap.Point(data[0].lng, data[0].lat),
                          new BMap.Point(data[1].lng, data[1].lat)];
            var curve = new BMapLib.CurveLine(points,{strokeColor:"red", strokeWeight:5, strokeOpacity:0.5})
            map.addOverlay(curve);
            return curve;
          }

          function getOverlayOffset(pointA, pointB) {
            var delta = 0.07
            var center = [(pointA[0]+pointB[0])/2.0, (pointA[1]+pointB[1])/2.0];
            if ( Math.abs(pointB[1]-pointA[1]) < 0.000001 ) return [center[0], center[1]+delta];
            if ( Math.abs(pointB[0]-pointA[0]) < 0.000001 ) return [center[0]+delta, center[1]];
            var r = (pointB[1]-pointA[1])/(pointB[0]-pointA[0]);
            return [center[0]+delta, center[1]-delta/r];
          }

          function addMarker(target) {
            var copter = new BMap.Icon("assets/images/copter.png", new BMap.Size(43,24), {
              offset: new BMap.Size(10, 25)
            });
            var data = target.cornerPoints
            var point = getOverlayOffset([data[0].lng, data[0].lat], [data[1].lng, data[1].lat]);
            var marker = new BMap.Marker(new BMap.Point(point[0], point[1]), {icon: copter});
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
