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
    function taxiController($scope,iotUtil) {
        var data_info = [[110.198611,20.2761111, 110.35105,20.024108,  "徐闻 海航大厦"],
           [110.198611,20.2761111, 110.162196,20.046835, "徐闻 海口港"],
           [110.198611,20.2761111, 110.468596,19.944221, "徐闻 美兰"]];

        $scope.drawMap = function drawMap(data_info) {
          // 百度地图API功能
        	var map = new BMap.Map("air-taxi-map");
        	map.centerAndZoom(new BMap.Point(110.340278,20.1000), 11);
        	map.disableDoubleClickZoom();
        	map.disableInertialDragging();

        	for(var i=0;i<data_info.length;i++){
        		var points = [new BMap.Point(data_info[i][0], data_info[i][1]),
        				new BMap.Point(data_info[i][2], data_info[i][3])];
        		var curve = new BMapLib.CurveLine(points,{strokeColor:"gray", strokeWeight:5, strokeOpacity:0.5});
        		var content = data_info[i][4];
        		//curve加上content
        		map.addOverlay(curve);
        		addClickHandler(content,curve,i);
        	}

        	function addClickHandler(content,curve){
        		curve.addEventListener("click",function(e){
              selectRouting(e.target);
            }
        		);
        	}

          function selectRouting(target) {
            target.w.strokeColor = "red";
            var data = target.Ku
            var points = [new BMap.Point(data.Ke, data.Ee),
        				new BMap.Point(data.Fe, data.Je)];
            map.addOverlay(new BMapLib.CurveLine(points,{strokeColor:"red", strokeWeight:5, strokeOpacity:0.5}));
          }
        };
        $scope.drawMap(data_info);

    }

})();
