/**
 * Created by Otherplayer on 16/7/21.
 */
(function() {
        'use strict';

        angular.module('airsc').controller('taxiController', taxiController);

        /** @ngInject */
        function taxiController($scope, iotUtil, transUtilsService) {
            /* jshint validthis: true */
            var vm = this;

            var response = "徐闻,110.198611,20.2761111;海航大厦,110.35105,20.024108;" +
                "徐闻,110.198611,20.2761111;海口港,110.162196,20.046835;" +
                "徐闻,110.198611,20.2761111;美兰,110.468596,19.944221;11,110.340278,20.1000";
            vm.mapPoints = transUtilsService.extractPoints(response);

            var drawMap = function(target, points) {
              var map = new BMap.Map(target);
              map.disableDragging();
              map.disableScrollWheelZoom();
              map.disableDoubleClickZoom();
              map.disablePinchToZoom();

              var markerPoints = [];
              _.each(points, function(pt){
                var point = new BMap.Point(pt[0], pt[1]);
                var icon = new BMap.Icon("assets/images/airtaxi/map-marker.png",
                  new BMap.Size(40, 40));
                var marker = new BMap.Marker(point, {icon: icon});
                var label = new BMap.Label(pt[2], {
                    offset: new BMap.Size(40, 20)
                });
                label.setStyle({
                  color : "#50bbff",
                  fontSize : "14px",
                  backgroundColor :"0.3",
                  border :"0",
                });
                marker.setOffset(new BMap.Size(-5, -10));
                marker.setLabel(label);
                map.addOverlay(marker);
                marker.addEventListener("click", function(e){
                  var point = e.currentTarget.point;
                  var citySelected = _.find(citylist, function(city) {
                    return city.longitude == point.lng && city.latitude == point.lat;
                  });
                  $scope.$apply(function(){
                    $scope.city = citySelected.name;
                    $('#city-navi-autocomplete-placeholder').val($scope.city);
                  });
                });
                markerPoints.push(point);
              });
              map.setViewport(markerPoints);
            }
            var citylist = [{
                    'name': '北京',
                    'type': 'city',
                    'longitude': 116.8136103013,
                    'latitude': 39.9110666857
                },
                {
                    'name': '宁波',
                    'type': 'city',
                    'longitude': 121.5566711543,
                    'latitude': 29.8802067266
                }, {
                    'name': '桂林',
                    'type': 'city',
                    'longitude': 110.2964461438,
                    'latitude': 25.2798404899
                }, {
                    'name': '海南',
                    'type': 'island',
                    'longitude': 110.7014103894,
                    'latitude': 20.0513000258
                }
            ];
            var citys = _.pluck(citylist, 'name');
            var autocomplete = function() {
                var autocompleteDropdownPlaceholder = myApp.autocomplete({
                    input: '#city-navi-autocomplete-placeholder',
                    openIn: 'dropdown',
                    source: function(autocomplete, query, render) {
                        var results = [];
                        // Find matched items
                        for (var i = 0; i < citys.length; i++) {
                            if (citys[i].toLowerCase().indexOf(query.toLowerCase()) >= 0)
                              results.push(citys[i]);
                        }
                        // Render items by passing array with result items
                        render(results);
                    }
                });
            };
            autocomplete();
            var points = _.map(citylist, function(city) {
              return [city.longitude, city.latitude, city.name];
            })
            drawMap("airtaxi-map-view", points);
    }
})();
