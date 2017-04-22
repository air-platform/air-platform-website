(function() {
    'use strict';

    //scheduleUtilsService
    angular.module('airsc')
        .factory('scheduleUtilsService', scheduleUtilsService);

    function scheduleUtilsService() {

        var validateSchedules = function(schedules) {
            var errors = {};
            if (schedules.length == 0) {
                errors.arrayLength = "行程不能为空！";
                return errors;
            }
            if (!schedules[0].departure) {
                errors.departure = "出发地不能为空！";
            }
            if (!schedules[0].arrival) {
                errors.arrival = "到达地不能为空！";
            }
            if (!schedules[0].date) {
                errors.date = "日期不能为空！";
            }
            if (!schedules[0].time) {
                errors.time = "时段不能为空！";
            }
            if (!schedules[0].flight) {
                errors.flight = "航班信息不能为空！";
            }
            return errors;
        };

        var timeSlots = function(from, to, step, interval) {
            if(!interval) interval = step;
            return _.map(_.range(from, to, step), function(hour) {
                return (hour>9?hour:("0"+hour)) + ":00-" +
                       (hour+interval>9?hour+interval:"0"+(hour+interval))+":00";
            });
        };

        var arrivals = function(routes, departure) {
            return _.uniq(_.pluck(_.where(routes, {departure: departure}), 'arrival'));
        }

        var departures = function(routes) {
          return _.uniq(_.pluck(routes, 'departure'));
        }

        return {
            'validateSchedules': validateSchedules,
            'timeSlots': timeSlots,
            'arrivals': arrivals,
            'departures': departures
        };
    }
})();
