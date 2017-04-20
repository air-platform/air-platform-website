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
        var transScope = angular.element($('[data-page=airtrans]')).scope();
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
              transScope.schedules[0].flight = plane.name + "-" + plane.flightNo;
            },
          0);
        };

        controller.init = function() {
          if(controller.planeModel) {
            var dash = _.indexOf(controller.planeModel, '-')
            var flightNo = controller.planeModel.substring(0, dash);
            var planeName = controller.planeModel.substring(dash+1);
            controller.planeSelected = _.where(controller.aircrafts, {name: planeName, flightNo: flightNo})
            controller.planeSelected = controller.planeSelected.length>0?controller.planeSelected[0]:null;
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
