/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderController', orderController);

    /** @ngInject */
    function orderController($scope,iotUtil) {
        var queryData = myApp.views[0].activePage.query;
        $scope.jumpOrder = jumpOrder;

        function jumpOrder() {
            var page = queryData.page || 'travel-detail';
            mainView.router.loadPage('app/components/airjet/' + page + '.html?order=' + queryData.order);
        };
    }
})();