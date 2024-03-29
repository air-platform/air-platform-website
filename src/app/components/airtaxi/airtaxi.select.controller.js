(function () {
    'use strict';

    angular.module('airsc').controller('airtaxiSelectController', airtaxiSelectController);

    /** @ngInject */
    function airtaxiSelectController($scope, iotUtil,$rootScope,constdata) {

      var controller = this;
      mainView.pageData = mainView.pageData || {};
      controller.site = mainView.pageData.site;
      controller.planes = mainView.pageData.site.aircraftItems;
      var PLANE_TYPE = {
        'helicopters': '直升机',
        'fixedwings': '固定翼'
      }

    	$scope.gotoOrderAction = gotoOrderAction;

      $scope.getDuration = function(flight) {
        return controller.site.tourTime;
      };

    	function gotoOrderAction(item) {

        if (iotUtil.islogin()){
            // no mainView.pageData.schedules for circle tour
            mainView.pageData.planeModel = item;
            mainView.pageData.from = 'airtaxi';
            mainView.pageData.type = 'airtour';
            mainView.router.loadPage('app/components/order/orderadd.html');
        }else{
            $rootScope.$emit(constdata.notification_refresh_information,{action:'login'});
        }

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
