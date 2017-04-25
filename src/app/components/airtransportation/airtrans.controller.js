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
            NotificationService, scheduleUtilsService,$rootScope,constdata) {
        var queryData = myApp.views[0].activePage.query;
        var controller = this;
        var MAX_SCHEDULE_NUM = 4;
        var ROUTES_FAMILIES = {'air-taxi-cross-channel': '飞越海峡', 'mongolia-routes': '内蒙航线'};
        $scope.schedules = [];
        $scope.routes = [];
        controller.mapPoints = [];
        controller.datepicker = {};
        controller.transports = [];
        controller.map = {};
        if(queryData.tabActive === 'tab1'){
          $scope.tabActive = 'tab1';
          myApp.showTab('#air-taxi-cross-channel');
        }

        if(queryData.tabActive === 'tab2'){
          $scope.tabActive = 'tab2';
          myApp.showTab('#mongolia-routes');
        }

        $scope.family = ROUTES_FAMILIES[$('.page[data-page="airtrans"] .tab.active').attr('id')];
        $timeout(function() {
          $('.airtrans-schedule-dateinput').each(function() {
            return createDatePicker(this);
          });
        });

        var loadTransports = function(page, family) {
          var hasMore = true;
          var page = 1;
          NetworkService.get("transports",
          {page: page, family: family},
          function getMapMakers(res) {
            var data = res.data;
            hasMore = data.hasNextPage;
            page = data.page;
            controller.transports = controller.transports.concat(data.content);
            $scope.routes = parseRoutes(controller.transports);
            controller.mapPoints = _.flatten(_.map(controller.transports, function(transport) {
              return [[transport.flightRoute.departure,
                      transport.flightRoute.departureLongitude,
                      transport.flightRoute.departureLatitude],
                      [transport.flightRoute.arrival,
                      transport.flightRoute.arrivalLongitude,
                      transport.flightRoute.arrivalLatitude]]
            }), true);
          }, function(res) {
            NotificationService.alert.error(res.statusText, null);
            hasMore = false;
          });
          return {
            "hasMore": hasMore,
            "page": page
          };
        }

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
          mainView.pageData.planeModel = schedule.flight
          mainView.pageData.aircrafts = _.uniq(
            _.flatten(
            _.pluck(_.where($scope.routes,
            {departure: $scope.schedules[0].departure,
            arrival: $scope.schedules[0].arrival}), 'flights')
            )
          );
          mainView.router.loadPage(goto);
        }

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

        var parseRoutes = function(transports) {
          return _.map(transports, function(transport){
            return {
              'departure': transport.flightRoute.departure,
              'arrival': transport.flightRoute.arrival,
              'flights': transport.aircraftItems
            }
          });
        }

        var createDatePicker = function(input) {
          var today = new Date();
          var calendarDateFormat = myApp.calendar({
            input: input,
            dateFormat: 'yyyy-mm-dd',
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
            loadTransports(1, $scope.family);
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
          }
        });

        $scope.$watch('schedules', function(newValue, oldValue){
          function routesEqual(flight1, flight2) {
            return flight1.departure == flight2.departure &&
                  flight1.arrival == flight2.arrival;
          }
          if(!routesEqual(newValue[0], oldValue[0])) {
            mapUtilsService.removeMarkedCurve(controller.map);
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
        }, true);

        $scope.$watch(function() {
          return controller.mapPoints;
        }, function(newValue, oldValue) {
            if( newValue != oldValue ) {
              if(controller.mapPoints.length > 0) {
                var mapviewid = ($scope.family == "飞越海峡")?'airtrans-map-view-channel' : 'airtrans-map-view-mongolia';
                controller.map = mapUtilsService.drawMap(mapviewid, controller.mapPoints, {curves: true, markers: true});
                  if (queryData.departure != null){
                      mapUtilsService.removeMarkedCurve(controller.map);
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
