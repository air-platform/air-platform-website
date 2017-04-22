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
    function transController($scope, iotUtil, NetworkService, mapUtilsService,
            NotificationService, scheduleUtilsService) {
        var controller = this;
        var MAX_SCHEDULE_NUM = 4;
        var ROUTES_FAMILY = "飞越海峡";
        $scope.schedules = [];
        $scope.routes = [];
        controller.mapPoints = [];
        controller.datepicker = {};
        controller.transports = [];

        var loadTransports = function(page) {
          var hasMore = true;
          var page = 1;
          NetworkService.get("transports",
          {page: page, family: ROUTES_FAMILY},
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

        controller.selectFlight = function(schedule) {
          var goto = "app/components/airtransportation/planes.html"
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
        //     setTimeout(function() {
        //       controller.datepicker = createDatePicker();
        //     }, 0);
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
          mainView.pageData = {
            'from': 'airtrans',
            'schedules': data[0],
            'planeModel': planeModel
          };
          mainView.router.loadPage('app/components/order/orderadd.html');
        }

        controller.timeSlots = function() {
          return _.map(_.range(9,17,2), function(hour) {
            return (hour>9?hour:("0"+hour)) + ":00-" + (hour+2>9?hour+2:"0"+(hour+2))+":00"
          });
        };

        controller.arrivals = function(routes, departure) {
            return _.uniq(_.pluck(_.where(routes, {departure: departure}), 'arrival'));
        }

        controller.departures = function(routes) {
          return _.uniq(_.pluck(routes, 'departure'));
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

        var createDatePicker = function() {
          var today = new Date();
          var calendarDateFormat = myApp.calendar({
            input: '#airtrans-schedule-datepicker-0',
            dateFormat: 'yyyy年m月d日',
            disabled: {
              to: new Date().setDate(today.getDate() - 1)
            },
            onDayClick: function(p) {
              calendarDateFormat.close();
            }
          });
          return calendarDateFormat;
        }

        // var hasMore = loadTransports(1)
        // while(hasMore) {
        //   hasMore = loadTransports(1);
        // }
        loadTransports(1);

        $scope.$watch(function() {
          return controller.mapPoints;
        }, function(newValue, oldValue) {
            if( newValue != oldValue ) {
              if(controller.mapPoints.length > 0) {
                mapUtilsService.drawMap("airtrans-map-view", controller.mapPoints);
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
        setTimeout(function() {
          controller.datepicker = createDatePicker();
        }, 0);

    }

})();
