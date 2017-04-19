/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelDetailController', travelDetailController);

    /** @ngInject */
    function travelDetailController($scope, StorageService) {
        var transferData = StorageService.get('plan');
        $scope.removeOrder = removeOrder;
        $scope.submit = submit;
        if(transferData) {
            $scope.detailData = transferData;
        }

        function removeOrder(data) {
            if(data.order) {
                mainView.router.loadPage('app/components/airjet/airjet.html');
            }
        }

        function submit(data){
            if(data){
                mainView.router.loadPage('app/components/airjet/order-success.html');
            } else {
                mainView.router.loadPage('app/components/airjet/order-fail.html')
            }
        }
    }
})();