/**
 * Created by Otherplayer on 16/7/21.
 */
(function() {
        'use strict';

        angular.module('airsc').controller('taxiController', taxiController);

        /** @ngInject */
        function taxiController($scope, iotUtil, mapUtilsService, MapService) {
            /* jshint validthis: true */
            var vm = this;
            // app/components/airtaxi/airtour-city.html?city={{city}}
            $scope.city = "";
            vm.autocomplete = {};

            vm.next = function() {
              if(_.contains(citys, $scope.city)) {
                mainView.query = {"city": $scope.city};
                mainView.loadPage("app/components/airtaxi/airtour-city.html");
              } else {
                var message = '此城市尚无相关业务!';
                if(!$scope.city) message = "请选择城市!";
                myApp.alert(message, '城市选择');
              }
            }
            var drawMap = function(target, points) {
              // MapService.mapPromise().then(function () {
                var map = new BMap.Map(target);
                map.disableDragging();
                map.disableScrollWheelZoom();
                map.disableDoubleClickZoom();
                map.disablePinchToZoom();

                var markerPoints = [];
                _.each(points, function(pt){
                  var point = new BMap.Point(pt[0], pt[1]);
                  var icon = new BMap.Icon("assets/images/airtaxi/map-marker.svg",
                    new BMap.Size(40, 40));
                  var marker = new BMap.Marker(point, {icon: icon});
                  var label = new BMap.Label(pt[2], {
                    offset: new BMap.Size(40, 20)
                  });
                  label.setStyle({
                    fontSize : "14px",
                    height: "23px"
                  });
                  marker.setOffset(new BMap.Size(-5, -20));
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
                      vm.next();
                    });
                  });
                  markerPoints.push(point);
                });
                map.setViewport(markerPoints);
              // });

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
                    // close filtering
                        var results = citys;
                        // var results = [];
                        // // Find matched items
                        // for (var i = 0; i < citys.length; i++) {
                        //     if (citys[i].toLowerCase().indexOf(query.toLowerCase()) >= 0)
                        //       results.push(citys[i]);
                        // }
                        // Render items by passing array with result items
                        render(results);
                    },
                    onChange: vm.next,
                    onOpen: function(e) {
                      $('.city-navi-button .f7-icons').text('chevron_up');
                    },
                    onClose: function(e) {
                      $('.city-navi-button .f7-icons').text('chevron_down');
                    }
                });
                return autocompleteDropdownPlaceholder;
            };
            vm.autocomplete = autocomplete();

            vm.toggleSelect = function() {
              if(vm.autocomplete.opened)
                vm.autocomplete.close();
              else {
                vm.autocomplete.open();
              }
            }

            var points = _.map(citylist, function(city) {
              return [city.longitude, city.latitude, city.name];
            })
            drawMap("airtaxi-map-view", points);
    }
})();
