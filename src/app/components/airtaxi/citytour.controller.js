/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function() {
  'use strict';

  angular.module('airsc').controller('citytourController', citytourController);

  /** @ngInject */
  function citytourController($scope, $timeout, mapUtilsService, NotificationService,
    NetworkService, StorageService, scheduleUtilsService,iotUtil,$rootScope,constdata, DATEPICKER) {
    var controller = this;
    var citys = ['北京', '桂林', '海南', '宁波'];
    var today = new Date();

    var init = function() {
      var queryData = mainView.query;
      $scope.jumpDetail = jumpDetail;
      $scope.sitesList = [];
      $scope.city = queryData.city || citys[0];
      angular.element('#citytour-title').text($scope.city + '观光');
      $scope.routes = [];
      $scope.schedules = [{
        'date': '',
        'time': '',
        'departure': '',
        'arrival': '',
        'flight': ''
      }];
      controller.mapPoints = controller.mapPoints || [];
      controller.taxiRoutes = [];
      controller.map = {};
      if(StorageService.get(constdata.cookie.airtaxi.data)){
        $scope.schedules = StorageService.get(constdata.cookie.airtaxi.data);
      }

      setTimeout(function() {
        controller.datepicker = createDatePicker();
        var available = new Date(controller.topDatepicker.params.disabled.to);
        var date = new Date(available.setDate(available.getDate()+1));
        $scope.tourdate = convertDate(date);
      }, 0);
    }
    var loadTourList = function(page) {
      NetworkService.get("tours", {
        city: $scope.city,
        page: page
      }, function(res) {
        var data = res.data;
        $scope.sitesList = $scope.sitesList || [];
        $scope.sitesList = $scope.sitesList.concat(data.content);
      }, function(res) {
        NotificationService.alert.error(res.statusText, null);
      });
    }
    var loadMapData = function(page) {
      NetworkService.get("taxis", {
        city: $scope.city,
        page: page
      }, function(res) {
        var data = res.data;
        controller.taxiRoutes = controller.taxiRoutes.concat(data.content);
        controller.mapPoints = parseMapPoints(controller.taxiRoutes);
        $scope.routes = parseRoutes(controller.taxiRoutes);
      }, function(res) {
        NotificationService.alert.error(res.statusText, null);
      });
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

    controller.submitSchedules = function() {
      var data = $scope.schedules;
      var errors = scheduleUtilsService.validateSchedules(data);
      if (_.keys(errors).length != 0) {
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
        'from': 'airtrans',
        'schedules': data[0],
        'type': 'airtaxi',
        'route': route,
        'planeModel': planeModel
      };
      mainView.router.loadPage('app/components/order/orderadd.html');
    }

    controller.selectFlight = function(schedule) {
      var goto = "app/components/airtransportation/planes.html"
      mainView.pageData = mainView.pageData || {};
      mainView.pageData.planeModel = schedule.flight
      mainView.pageData.aircrafts = _.uniq(
        _.flatten(
          _.pluck(_.where($scope.routes, {
            departure: $scope.schedules[0].departure,
            arrival: $scope.schedules[0].arrival
          }), 'flights')
        )
      );
      mainView.router.loadPage(goto);
    }

    controller.curvePoints = function(transports, flight) {
      var route = _.find(transports, function(transport){
          return transport.departure == flight.departure &&
                 transport.arrival == flight.arrival;
      });
      if(route) {
        var departure = _.map(route.departLoc.split(','), function(num){ return parseFloat(num); });
        var arrival = _.map(route.arrivalLoc.split(','), function(num){ return parseFloat(num); });
        return [[route.departure, departure[0], departure[1]],
                [route.arrival, arrival[0], arrival[1]]];
      } else {
        return [];
      }
    }

    // TODO: dynamic loading
    // var pickerDevice = myApp.picker({
    //     input: '#citytour-title',
    //     cols: [
    //         {
    //             textAlign: 'center',
    //             values: citys,
    //         }
    //     ],
    //     onChange: function(item, current){
    //       angular.element('#citytour-title').text(current + '观光');
    //       $scope.city = current;
    //     },
    //     onOpen: function() {
    //       pickerDevice.setValue(angular.element('#citytour-title').text().replace("观光", ""));
    //     }
    // });

    var parseMapPoints = function(taxiRoutes) {
      var points = [];
      _.map(taxiRoutes, function(route) {
        var departureLocs = _.map(route.departLoc.split(','), function(num) {
          return parseFloat(num);
        })
        var arrivalLocs = _.map(route.arrivalLoc.split(','), function(num) {
          return parseFloat(num);
        })
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
          'flights': route.aircraftItems,
          'timeEstimation':route.duration
        };
      });
    };

    var createTopNavCalendar = function(config) {
      var disabled = {
        to: new Date().setDate(today.getDate() - 1)
      };
      if(config && config.disabled) {
        disabled = config.disabled;
      }
      var calendarDateFormat = myApp.calendar({
        input: '#tourcity-datepicker',
        dateFormat: 'yyyy-mm-dd',
        monthNames: DATEPICKER.monthNames,
        dayNamesShort: DATEPICKER.dayNamesShort,
        disabled: disabled,
        onDayClick: function(item, ele, year, month, day) {
          $scope.tourdate = convertDate(new Date(year, month, day));
          calendarDateFormat.close();
        },
        onOpen: function(p) {
          var available = new Date(calendarDateFormat.params.disabled.to);
          calendarDateFormat.setYearMonth(available.getFullYear(), available.getMonth(), 10);
          if(!calendarDateFormat.value)
            calendarDateFormat.setValue([$scope.tourdate]);
        }
      });
      return calendarDateFormat;
    }

    var convertDate = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString();
      var dd = date.getDate().toString();

      var mmChars = mm.split('');
      var ddChars = dd.split('');

      return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
    }

    function jumpDetail(site) {
      if (!$scope.tourdate) {
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

    init();

    $scope.$watch('city', function(newValue, oldValue) {
      loadTourList(1);
      if (newValue == '海南') {
        loadMapData(1);
        $('body').trigger('citytour.addMapView');
      }
      // temporarily set '桂林' available from 2017-05-11
      if(newValue == '桂林') {
        if(today - new Date('2017-05-11'))
        var availableDate = today - new Date('2017-05-11') > 0?today:new Date('2017-05-11');
        delete controller.topDatepicker;
        controller.topDatepicker = createTopNavCalendar({
          'disabled': { 'to': availableDate.setDate(availableDate.getDate()-1) }
        });
      } else {
        delete controller.topDatepicker;
        controller.topDatepicker = createTopNavCalendar();
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
      if(!routesEqual(newValue[0], oldValue[0])) {
        mapUtilsService.removeMarkedCurve(controller.map);
        if(newValue[0].departure && newValue[0].arrival) {
          if(!_.contains(controller.arrivals($scope.routes, newValue[0].departure), newValue[0].arrival)) {
            $timeout(function() {
              $scope.schedules[0].arrival= '';
            });
          }
          var points = controller.curvePoints(controller.taxiRoutes, $scope.schedules[0]);
          if (!_.isEmpty(points)) {
            mapUtilsService.markCurve(controller.map, points);
          }
        }
      }
      StorageService.put(constdata.cookie.airtaxi.data, $scope.schedules);
    }, true);

    $scope.$watch(function() {
      return controller.mapPoints;
    }, function(newValue, oldValue) {
      if (newValue != oldValue && !_.isEmpty(newValue)) {
        controller.map = mapUtilsService.drawMap('airtaxi-island-mapview',
                controller.mapPoints, {
                  markers: true, labels: 'onclick'
                },function (map) {
              mapUtilsService.drawFakePoints(map);
            });
      }
    });

    $$(document).on('page:afterback', '.page[data-page=citytour]', function(e) {
      $('.subnavbar.tourview-subnavbar').remove();
    });

    $('body').on('citytour.addMapView', function(e) {
      angular.element('#citytour-title').text('Air Taxi');
      $('.airtour-city').append($('<div class="subnavbar tourview-subnavbar">' +
        '<div class="buttons-row air-tabs airtaxi-nav">' +
        '<a href="#island-mapview-order" class="tab-link active"><span>海岛行</span></a>' +
        '<a href="#tour-project-list" class="tab-link"><span>蜈支洲岛</span></a>' +
        '</div>' +
        '</div>'));
      myApp.showTab('#island-mapview-order');
    });


  };

})();
