/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('transController', transController);

    /** @ngInject */
    function transController($scope, $timeout, iotUtil, NetworkService, mapUtilsService,
            NotificationService, scheduleUtilsService, StorageService, $rootScope, constdata, DATEPICKER) {
        var queryData = myApp.views[0].activePage.query;
        var controller = this;
        var MAX_SCHEDULE_NUM = 4;
        var ROUTES_FAMILIES = {'air-taxi-cross-channel': '飞越海峡', 'mongolia-routes': '内蒙航线'};
        var storageData = StorageService.get(constdata.cookie.airtrans.data);
        $scope.routesStatus = false;
        $scope.schedules = [];
        $scope.routes = [];
        controller.tabSwitch = tabSwitch;
        controller.mapPoints = [];
        controller.datepicker = {};
        controller.transports = [];
        controller.map = {};

        if(queryData.tabActive){
          tabSwitch('#' + queryData.tabActive);
        }
        if(StorageService.get(constdata.cookie.airtrans.tab)){
          tabSwitch(StorageService.get(constdata.cookie.airtrans.tab));
        }

        $scope.family = ROUTES_FAMILIES[$('.page[data-page="airtrans"] .tab.active').attr('id')];
        $timeout(function() {
          $('.airtrans-schedule-dateinput').each(function() {
            return createDatePicker(this);
          });
        });

        var loadTransports = function(start, family) {
          $scope.routesStatus = true;
          var loadPage = function(page) {
            NetworkService.get("transports", {
              'page': page, 'family': family
            }, function(res) {
              var data = res.data;
              if(page == 1) controller.transports = [];
              controller.transports = controller.transports.concat(data.content);
              if(data.hasNextPage) {
                loadPage(data.page + 1);
              } else {
                $scope.routes = parseRoutes(controller.transports);
                controller.mapPoints = _.flatten(_.map(controller.transports, function(transport) {
                  return [[transport.flightRoute.departure,
                          transport.flightRoute.departureLongitude,
                          transport.flightRoute.departureLatitude],
                          [transport.flightRoute.arrival,
                          transport.flightRoute.arrivalLongitude,
                          transport.flightRoute.arrivalLatitude]]
                }), true);
              }
              $scope.routesStatus = false;
            }, function(res) {
              NotificationService.alert.error(res.statusText, null);
            });
          };
          loadPage(start);
        };

        $scope.schedules = [
            {
                'date': '',
                'time': '',
                'departure': '',
                'arrival': '',
                'flight': ''
            }
        ];

        if (queryData.departure != null){
            var param = queryData.departure.split(',');
            $scope.schedules = [
                {
                    'date': '',
                    'time': '',
                    'departure': param[0],
                    'arrival': param[1],
                    'flight': ''
                }
            ];
        }


        controller.selectFlight = function(schedule) {
          var goto = "app/components/airtransportation/planes.html";
          mainView.pageData = mainView.pageData || {};
          mainView.pageData.planeModel = schedule.flight;
          mainView.pageData.route = _.where($scope.routes,
          {departure: $scope.schedules[0].departure,
          arrival: $scope.schedules[0].arrival}
          );
          mainView.pageData.aircrafts = _.uniq(
            _.flatten(
            _.pluck(_.where($scope.routes,
            {departure: $scope.schedules[0].departure,
            arrival: $scope.schedules[0].arrival}), 'flights')
            )
          );
          mainView.router.loadPage(goto);
        }

        function tabSwitch(tab, status) {
            StorageService.put(constdata.cookie.airtrans.tab, tab);
            if(!status){
              myApp.showTab(tab);
            }
        };

        // controller.addSchedule = function() {
        //   if($scope.schedules.length >= MAX_SCHEDULE_NUM) {
        //     NotificationService.alert.error("已达到单订单上限行程数量！", null);
        //     return;
        //   };
        //   var errors = scheduleUtilsService.validateSchedules($scope.schedules);
        //   if(_.keys(errors).length > 0) {
        //     NotificationService.alert.error(errors[_.keys[0]], null);
        //     return;
        //   } else {
        //     var schedule = {
        //       'date': '',
        //       'time': '',
        //       'departure': '',
        //       'arrival': '',
        //       'flight': ''
        //     };
        //     $scope.schedules.unshift(schedule);
        //     controller.datepicker = {};
        //     $timeout(function() {
        //       controller.datepicker = createDatePicker();
        //     });
        //   }
        // }

        controller.deleteSchedule = function(schedule) {
          $scope.schedules = _.without($scope.schedules, schedule);
        }

        controller.submitSchedules = function() {
          var data = $scope.schedules;
          var errors = scheduleUtilsService.validateSchedules(data);
          if(_.keys(errors).length != 0) {
            NotificationService.alert.error(errors[_.keys(errors)[0]], null);
            return;
          }
          var route = _.find($scope.routes, function(route) {
            return route.departure == data[0].departure && route.arrival == data[0].arrival;
          });
          var planeModel = _.find(route.flights, function(plane) {
            return plane.aircraft.name == data[0].flight;
          });


            //先登录

            if (!iotUtil.islogin()){
                $rootScope.$emit(constdata.notification_refresh_information,{action:'login'});
                return;
            }

          mainView.pageData = {
            'from': 'transportation',
            'type': 'transportation',
            'schedules': data[0],
            'route': route,
            'planeModel': planeModel
          };
          mainView.router.loadPage('app/components/order/orderadd.html');
        }

        controller.timeSlots = function() {
          var today = new Date();
          if(today - new Date($scope.schedules[0].date) > 0) {
            return _.filter(scheduleUtilsService.timeSlots(9, 17, 2), function(slot) {
              return parseInt(slot.split(':')[0]) > today.getHours();
            });
          }
          return scheduleUtilsService.timeSlots(9, 17, 2);
        };

        controller.arrivals = function(routes, departure) {
          return scheduleUtilsService.arrivals(routes, departure);
        }

        controller.departures = function(routes) {
          return scheduleUtilsService.departures(routes);
        }

        controller.curvePoints = function(transports, flight) {
          var route = _.find(transports, function(transport){
              return transport.flightRoute.departure == flight.departure &&
                     transport.flightRoute.arrival == flight.arrival;
          });
          if(route) {
            return [[route.flightRoute.departure, route.flightRoute.departureLongitude, route.flightRoute.departureLatitude],
                    [route.flightRoute.arrival, route.flightRoute.arrivalLongitude, route.flightRoute.arrivalLatitude]];
          } else {
            return [];
          }
        }

        controller.isRouteDisabled = function(newValue) {
          return (newValue[0].departure == '徐闻' && newValue[0].arrival == '美兰机场') ||
            (newValue[0].departure == '美兰机场' && newValue[0].arrival == '徐闻');
        }

        controller.temporarilyDisable = function() {
          return  ($scope.schedules[0].departure == '徐闻' && $scope.schedules[0].arrival == '美兰机场') ||
                ($scope.schedules[0].arrival == '徐闻' && $scope.schedules[0].departure == '美兰机场');
        }

        var parseRoutes = function(transports) {
          return _.map(transports, function(transport){
            return {
              'departure': transport.flightRoute.departure,
              'arrival': transport.flightRoute.arrival,
              'flights': transport.aircraftItems,
              'timeEstimation':transport.timeEstimation
            }
          });
        }

        var createDatePicker = function(input) {
          var today = new Date();
          var calendarDateFormat = myApp.calendar({
            input: input,
            dateFormat: 'yyyy-mm-dd',
            monthNames: DATEPICKER.monthNames,
            dayNamesShort: DATEPICKER.dayNamesShort,
            disabled: {
              to: new Date().setDate(today.getDate() - 1)
            },
            onDayClick: function(p) {
              calendarDateFormat.close();
            }
          });
          return calendarDateFormat;
        }

        $scope.$watch('family', function() {
          if($scope.family) {
            controller.transports = [];
            $scope.schedules = [
                {
                    'date': '',
                    'time': '',
                    'departure': '',
                    'arrival': '',
                    'flight': ''
                }
            ];
            if(storageData){
              if(storageData[0] && $scope.family === '飞越海峡'){
                $scope.schedules = storageData[0];
              }
              if(storageData[1] && $scope.family === '内蒙航线'){
                $scope.schedules = storageData[1];
              }
            }

            loadTransports(1, $scope.family);
              if (queryData.departure != null &&  $scope.family == '飞越海峡'){
                  var param = queryData.departure.split(',');
                  $scope.schedules = [
                      {
                          'date': '',
                          'time': '',
                          'departure': param[0],
                          'arrival': param[1],
                          'flight': ''
                      }
                  ];
              }

              if (queryData.departure != null &&  $scope.family == '内蒙航线'){
                  $scope.schedules = [
                      {
                          'date': '',
                          'time': '',
                          'departure': '',
                          'arrival': '',
                          'flight': ''
                      }
                  ];
              }
          }
        });

        $scope.$watch('schedules', function(newValue, oldValue){
          function routesEqual(flight1, flight2) {
            return flight1.departure == flight2.departure &&
                  flight1.arrival == flight2.arrival;
          }
          //TODO: fixed bug: not reset time
          if(!_.contains(controller.timeSlots(), $scope.schedules[0].time))
            angular.element('[ng-model="schedule.time"] + .item-content .smart-select-value').text("选择时间段");
          if(!routesEqual(newValue[0], oldValue[0]) && !$scope.routesStatus) {
            if(controller.isRouteDisabled(newValue)) {
              NotificationService.alert.success('线路即将开放，敬请期待！', null);
            }
            mapUtilsService.removeMarkedCurve(controller.map, true);
            if(newValue[0].departure && newValue[0].arrival) {
              if(!_.contains(controller.arrivals($scope.routes, newValue[0].departure), newValue[0].arrival)) {
                $timeout(function() {
                  $scope.schedules[0].arrival= '';
                });
              }
              var points = controller.curvePoints(controller.transports, $scope.schedules[0]);
              if (!_.isEmpty(points)) {
                mapUtilsService.markCurve(controller.map, points);
              }
            }
          }
          var saveData = storageData || [];
          if($scope.family === '飞越海峡') {
            saveData[0] = $scope.schedules;
          } else {
            saveData[1] = $scope.schedules;
          }
          StorageService.put(constdata.cookie.airtrans.data, saveData);
        }, true);

        $scope.$watch(function() {
          return controller.mapPoints;
        }, function(newValue, oldValue) {
            if( newValue != oldValue ) {
              if(controller.mapPoints.length > 0) {
                var mapviewid = ($scope.family == "飞越海峡")?'airtrans-map-view-channel' : 'airtrans-map-view-mongolia';
                controller.map = mapUtilsService.drawMap(mapviewid, controller.mapPoints,
                    {curves: true, markers: true, labels: 'static'});
                  if (queryData.departure != null){
                      mapUtilsService.removeMarkedCurve(controller.map, true);
                      if($scope.schedules[0].departure && $scope.schedules[0].arrival) {
                          if(!_.contains(controller.arrivals($scope.routes, $scope.schedules[0].departure), $scope.schedules[0].arrival)) {
                              $timeout(function() {
                                  $scope.schedules[0].arrival= '';
                              });
                          }
                          var points = controller.curvePoints(controller.transports, $scope.schedules[0]);
                          if (!_.isEmpty(points)) {
                              mapUtilsService.markCurve(controller.map, points);
                          }
                      }
                  }
              }
            }
          }
        );
        $('body').on('airtrans.selectRoute', function(e, data) {
          var curve = data;
          var points = curve.cornerPoints;
          controller.transports;
          var selectedRoute = _.find(controller.transports, function(transport) {
            var route = transport.flightRoute;
            return route.departureLongitude == points[0].lng &&
                   route.departureLatitude == points[0].lat &&
                   route.arrivalLongitude == points[1].lng &&
                   route.arrivalLatitude == points[1].lat;
          });
          $scope.$apply(function(){
            $scope.schedules[0].departure = selectedRoute.flightRoute.departure;
            $scope.schedules[0].arrival = selectedRoute.flightRoute.arrival;
          });
        });

        $$('.page[data-page=airtrans] .tab').on('tab:show', function(e) {
          $scope.$apply(function() {
            $scope.family = ROUTES_FAMILIES[$('.page[data-page="airtrans"] .tab.active').attr('id')];
          });
          $timeout(function() {
            $('.airtrans-schedule-dateinput').each(function() {
              return createDatePicker(this);
            });
          });
        });
    }

})();
