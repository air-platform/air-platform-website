/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderController', orderController);

    /** @ngInject */
    function orderController($scope,iotUtil) {
        $scope.jump = jump;


        function jump(data) {
            if(data.order) {
                mainView.router.loadPage('app/components/airjet/travel-detail.html');
            }
        }
    }
})();