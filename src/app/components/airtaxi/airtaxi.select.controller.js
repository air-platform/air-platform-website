(function () {
    'use strict';

    angular.module('airsc').controller('airtaxiSelectController', airtaxiSelectController);

    /** @ngInject */
    function airtaxiSelectController($scope, iotUtil) {
      var controller = this;
      mainView.pageData = mainView.pageData || {};
      controller.site = mainView.pageData.site;
      controller.planeModel = {};
      controller.planes = mainView.pageData.site.aircraftItems;
      var PLANE_TYPE = {
        'helicopters': '直升机',
        'fixedwings': '固定翼'
      }

    	$scope.gotoOrderAction = gotoOrderAction;

      $scope.getDuration = function(flight) {
        return controller.site.tourTime;
      };

      $scope.selectFlight = function(flight) {
        controller.planeModel = flight;
      }

    	function gotoOrderAction() {
        // no mainView.pageData.schedules for circle tour
        mainView.pageData.planeModel = controller.planeModel;
        mainView.pageData.from = 'airtaxi';
        mainView.pageData.type = 'airtour';
        mainView.router.loadPage('app/components/order/orderadd.html');
      }

      $('.air-select .tab').on('tab:show', function(e) {
        var category = $(e.target).attr('data-type');
        $scope.$apply(function(){
          $scope.airSelectList = _.filter(controller.planes, function(p) {
            return p.aircraft.category == PLANE_TYPE[category];
          });
        });
      });

      setTimeout(function() {
        $('.air-select .tab:first-child').trigger('tab:show');
      }, 0);
    }
})();
