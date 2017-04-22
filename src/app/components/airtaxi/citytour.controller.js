/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('citytourController', citytourController);

    /** @ngInject */
    function citytourController($scope, mapUtilsService, NotificationService,
        NetworkService, scheduleUtilsService) {
      var controller = this;
      var citys = ['北京', '桂林', '海南', '宁波'];
      var today = new Date();

      var init = function() {
        var queryData = mainView.query;
        $scope.jumpDetail = jumpDetail;
        $scope.city = queryData.city || citys[0];
        angular.element('#citytour-title').text($scope.city + '观光');
        $scope.tourdate = convertDate(today);
        $scope.sitesList = [];
        $scope.routes = [];
        $scope.schedules = [
          {
            'date': '',
            'time': '',
            'departure': '',
            'arrival': '',
            'flight': ''
          }
        ];

        controller.taxiRoutes = [];
        controller.mapPoints = [];

        setTimeout(function(){
          controller.datepicker = createDatePicker();
        }, 0);
      }
      var loadTourList = function(page) {
        NetworkService.get("tours", {city: $scope.city, page: page}, function(res) {
          var data = res.data;
          $scope.sitesList = $scope.sitesList || [];
          $scope.sitesList = $scope.sitesList.concat(data.content);
        }, function(res) {
          NotificationService.alert.error(res.statusText, null);
        });
      }
      var loadMapData = function(page) {
        NetworkService.get("taxis", {city: $scope.city, page: page}, function(res) {
          var data = res.data;
          controller.taxiRoutes = controller.taxiRoutes.concat(data.content);
          controller.mapPoints = parseMapPoints(controller.taxiRoutes);
          $scope.routes = parseRoutes(controller.taxiRoutes);
        }, function(res) {
          NotificationService.alert.error(res.statusText, null);
        });
      }

      controller.timeSlots = function() {
        return scheduleUtilsService.timeSlots(9, 17, 1);
      };

      controller.arrivals = function(routes, departure) {
        return scheduleUtilsService.arrivals(routes, departure);
      }

      controller.departures = function(routes) {
        return scheduleUtilsService.departures(routes);
      }

      var pickerDevice = myApp.picker({
          input: '#citytour-title',
          cols: [
              {
                  textAlign: 'center',
                  values: citys,
              }
          ],
          onChange: function(item, current){
            angular.element('#citytour-title').text(current + '观光');
            $scope.city = current;
          },
          onOpen: function() {
            pickerDevice.setValue(angular.element('#citytour-title').text().replace("观光", ""));
          }
      });

      var parseMapPoints = function(taxiRoutes) {
        var points = [];
        _.map(taxiRoutes, function(route) {
          var departureLocs = _.map(route.departLoc.split(','), function(num){return parseFloat(num);})
          var arrivalLocs = _.map(route.arrivalLoc.split(','), function(num){return parseFloat(num);})
          points.push([route.departure, departureLocs[0], departureLocs[1]]);
          points.push([route.arrival, arrivalLocs[0], arrivalLocs[1]]);
        });
        return points;
      };

      var parseRoutes = function(taxiRoutes) {
        return _.map(taxiRoutes, function(route) {
          return {
            'departure': route.departure,
            'arrival': route.arrival,
            'flights': route.aircraftItems
          };
        });
      };
      var calendarDateFormat = myApp.calendar({
        input: '#tourcity-datepicker',
        dateFormat: 'yyyy-mm-dd',
        disabled: {
          to: new Date().setDate(today.getDate() - 1)
        },
        onDayClick: function(item, ele, year, month, day) {
            $scope.tourdate = convertDate(new Date(year, month, day));
            calendarDateFormat.close();
        }
      });

      var convertDate = function(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var mmChars = mm.split('');
        var ddChars = dd.split('');

        return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
      }

      function jumpDetail(site){
        if(!$scope.tourdate) {
          NotificationService.alert.success('请选择出行日期', null);
          return;
        }
        mainView.pageData = mainView.pageData || {};
        mainView.pageData.tourdate = $scope.tourdate;
        mainView.pageData.site = site;
        mainView.pageData.city = $scope.city;
        mainView.router.loadPage('app/components/airtaxi/project-details.html?date=' + $scope.tourdate);
      };

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

      $scope.$watch(function() {
        return angular.element('#citytour-title').text().replace("观光", "");
      }, function(oldValue, newValue) {
        loadTourList(1);
        loadMapData(1);
        if(newValue != oldValue) {
          loadTourList(1);
          if(newValue == '海南') {
            loadMapData(1);
          }
        }
      });
      $scope.$watch(function() {
        return controller.mapPoints;
      }, function(oldValue, newValue) {
        mapUtilsService.drawMap('airtaxi-island-mapview', controller.mapPoints);
        if(newValue != oldValue) {
          mapUtilsService.drawMap('airtaxi-island-mapview', controller.mapPoints);
        }
      });
      init();
    };
})();
