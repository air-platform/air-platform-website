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
    function transController($scope, iotUtil, NetworkService, transUtilsService) {
        var controller = this;
        $scope.schedules = [];
        controller.mapPoints = {};
        controller.datepicker = {};

        NetworkService.get("url", {}, function getMapMakers(res) {
          var pointsStr = res;
          controller.mapPoints = transUtilsService.extractPoints(pointsStr);
        }, null);
        var response = "徐闻,110.198611,20.2761111;海航大厦,110.35105,20.024108;" +
          "徐闻,110.198611,20.2761111;海口港,110.162196,20.046835;" +
          "徐闻,110.198611,20.2761111;美兰,110.468596,19.944221;11,110.340278,20.1000";

        $scope.schedules = [
          {
            'date': '2017-04-30',
            'time': '08:00 - 09:00',
            'departure': '徐闻',
            'arrival': '海口美兰机场',
            'flight': '首航直升机B-7186'
          }, {
            'date': '2017-06-03',
            'time': '14:30 - 15:30',
            'departure': '徐闻',
            'arrival': '海航大厦',
            'flight': '海南航空B-7898'
          }
        ]

        controller.mapPoints = transUtilsService.extractPoints(response);
        transUtilsService.drawMap("airtrans-map-view", controller.mapPoints);

        controller.addSchedule = function() {
          var errors = transUtilsService.validateSchedules($scope.schedules);
          if(errors.length > 0) {

          } else {
            var schedule = {
              'date': '',
              'time': '',
              'departure': '',
              'arrival': '',
              'flight': ''
            };
            $scope.schedules.unshift(schedule);
            controller.datepicker = {};
            setTimeout(function() {
              controller.datepicker = createDatePicker();
            }, 0);
          }
        }

        controller.deleteSchedule = function(schedule) {
          $scope.schedules = _.without($scope.schedules, schedule);
        }

        controller.submitSchedules = function() {
          var data = $scope.schedules;
          mainView.router.loadPage('app/components/order/orderadd.html');
          mainView.pageData = {
            'from': 'airtrans',
            'schedules': $scope.schedules
          };
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
              $(".schedule-title, .airtaxi-navbar").click();
            }
          });
          return calendarDateFormat;
        }

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
