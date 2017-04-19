/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelDetailController', travelDetailController);

    /** @ngInject */
    function travelDetailController($scope,iotUtil) {
        var queryData = myApp.views[0].activePage.query;
        $scope.removeOrder = removeOrder;
        $scope.submit = submit;
        if(queryData.jetdata) {
            $scope.detailData = JSON.parse(queryData.jetdata);
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