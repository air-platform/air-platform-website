/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('ordersucController', ordersucController);

    /** @ngInject */
    function ordersucController($scope, constdata) {
        var queryData = myApp.views[0].activePage.query;
        console.log(queryData);
        $scope.jumpOrder = jumpOrder;
        if(queryData.page && queryData.page.indexOf('taxi') !== -1) {
            angular.element('#airtaxi-back').attr('href', constdata.router.airtaxi.home);
        } else {
            angular.element('#airtaxi-back').attr('href', constdata.router.airtrans.home);
        }

        function jumpOrder() {
            mainView.router.loadPage('app/components/order/orderdetail.html?order=' + queryData.orderId);
        };
    }
})();