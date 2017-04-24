/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderController', orderController);

    /** @ngInject */
    function orderController($scope, constdata) {
        var queryData = myApp.views[0].activePage.query;
        $scope.jumpOrder = jumpOrder;
        if(queryData.page && queryData.page.indexOf('dream') !== -1) {
            angular.element('#airjet-back').attr('href', constdata.router.airjet.dream);
        } else if(queryData.page && queryData.page.indexOf('tour') !== -1) {
            angular.element('#airjet-back').attr('href', constdata.router.airjet.card)
        } else {
            angular.element('#airjet-back').attr('href', constdata.router.airjet.travel)
        }

        $scope.telephone = 'tel:' + constdata.supportTelephone;


        function jumpOrder() {
            var page = queryData.page || 'travel-detail';
            mainView.router.loadPage('app/components/airjet/' + page + '.html?order=' + queryData.order);
        };
    }
})();