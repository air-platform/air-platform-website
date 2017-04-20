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
    function transController($scope, iotUtil, NetworkService, transUtilsService, NotificationService) {
        var controller = this;
        var MAX_SCHEDULE_NUM = 4;
        var ROUTES_FAMILY = "飞越海峡";
        $scope.schedules = [];
        $scope.routes = [];
        controller.mapPoints = {};
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
          }, function(res) {
            NotificationService.alert.error(res.statusText, null);
            hasMore = false;
          });
          return {
            "hasMore": hasMore,
            "page": page
          };
        }

        var response = "徐闻,110.198611,20.2761111;海航大厦,110.35105,20.024108;" +
          "徐闻,110.198611,20.2761111;海口港,110.162196,20.046835;" +
          "徐闻,110.198611,20.2761111;美兰,110.468596,19.944221";

        $scope.schedules = [
          {
            'date': '',
            'time': '',
            'departure': '',
            'arrival': '',
            'flight': ''
          }
        ];

        controller.mapPoints = transUtilsService.extractPoints(response);
        transUtilsService.drawMap("airtrans-map-view", controller.mapPoints);

        controller.selectFlight = function(schedule) {
          var goto = "app/components/airtransportation/planes.html"
          mainView.pageData = mainView.pageData || {};
          mainView.pageData.planeModel = schedule.flight
          mainView.pageData.aircrafts = [];
          mainView.router.loadPage(goto);
        }

        // controller.addSchedule = function() {
        //   if($scope.schedules.length >= MAX_SCHEDULE_NUM) {
        //     NotificationService.alert.error("已达到单订单上限行程数量！", null);
        //     return;
        //   };
        //   var errors = transUtilsService.validateSchedules($scope.schedules);
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
          var errors = transUtilsService.validateSchedules(data);
          if(_.keys(errors).length != 0) {
            NotificationService.alert.error(errors[_.keys(errors)[0]], null);
            return;
          }
          mainView.router.loadPage('app/components/order/orderadd.html');
          mainView.pageData = {
            'from': 'airtrans',
            'schedules': data[0],
            'planeModel': {
                      "aircraftType": "G550",
                      "arrival": "沈阳",
                      "creationDate": "2017-04-20T03:03:31.000+0000",
                      "currencyUnit": "rmb",
                      "date": "2017-03-04",
                      "departure": "深圳",
                      "description": "",
                      "flightNo": "B-8100",
                      "id": "7f000101-5b89-1d93-815b-895096df0010",
                      "image": "http://ool5ftqf4.bkt.clouddn.com/Dream_G450_20170403_2.png;http://ool5ftqf4.bkt.clouddn.com/Dream_G450_20170403_1.png;http://ool5ftqf4.bkt.clouddn.com/Dream_G450_20170403_3.png",
                      "minPassengers": 3,
                      "name": "湾流G550",
                      "price": 150000,
                      "seatPrice": 18000,
                      "seats": 18,
                      "timeSlot": "9:00-20:00"
                    }
          };
        }

        controller.timeSlots = function() {
          return _.map(_.range(8,18), function(hour) {
            return (hour>9?hour:("0"+hour)) + ":00-" + (hour+1>9?hour+1:"0"+(hour+1))+":00"
          });
        };

        var parseRoutes = function(transports) {
          return _.map(transports, function(transport){
            return {
              'departure': transport.flightRoute.departure,
              'arrival': transport.flightRoute.arrival,
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

        $scope.$watch("controller.mapPoints", function(newValue, oldValue) {
            if( newValue != oldValue ) {
              transUtilsService.drawMap("airtrans-map-view", controller.mapPoints);
            }
          }
        );
        setTimeout(function() {
          controller.datepicker = createDatePicker();
        }, 0);

    }

})();
