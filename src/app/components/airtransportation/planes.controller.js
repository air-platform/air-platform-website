/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('planesController', planesController);

    /** @ngInject */
    function planesController($scope, iotUtil, NetworkService) {
        var controller = this;

        controller.planesContext = {
          "page": 1,
          "pageSize": 10,
          "totalRecords": 0,
          "hasContent": false,
          "totalPages": 0,
          "records": 0,
          "hasPreviousPage": false,
          "isFirstPage": true,
          "hasNextPage": false,
          "isLastPage": true
        };

        // TODO: variable cannot be accessed if refresh on this page
        var prevScope = angular.element($('[data-page=airtrans]')).scope() ||
                         angular.element($('[data-page=citytour]')).scope();
        mainView.pageData = mainView.pageData || {};
        controller.aircrafts = mainView.pageData.aircrafts;
        controller.planeModel = mainView.pageData.planeModel;

        controller.select = function(plane, $event) {
          $event.stopPropagation();
          $event.preventDefault();
          controller.planeSelected = plane;
          setTimeout(
            function(){
              $($event.target).closest('li').find('label.label-checkbox input').prop("checked", true);
              prevScope.schedules[0].flight = plane.aircraft.name;
            },
          0);
        };

        controller.getEstimationTime = function(plane) {
          // TODO: refactoring
          if(prevScope.trans) {
            var transport = _.find(prevScope.trans.transports, function(transport){
              return _.isEqual(transport.aircraftItems, controller.aircrafts);
            });
            return transport.timeEstimation;
          }
          if(prevScope.ctl) {
            var transport = _.find(prevScope.ctl.taxiRoutes, function(transport) {
              return _.isEqual(transport.aircraftItems, controller.aircrafts);
            });
            return transport.duration;
          }
          return 0;
        };

        controller.init = function() {
          if(controller.planeModel) {
            var planeName = controller.planeModel;
            controller.planeSelected = _.find(controller.aircrafts, function(item) {
              return item.aircraft.name == planeName;
            });
          }
          $.each($("#planes-selection").find("li"), function(i, el) {
            if($(el).find(".plane-name").text() == controller.planeModel) {
              $(el).trigger('click');
            }
          });
        };

        $scope.$watch('controller.aircrafts', function(oldValue, newValue) {
            if (newValue != oldValue) {
              // retrieve available planes according to type
            }
        });
        setTimeout(function(){
          controller.init();
        }, 0);
    }

})();
