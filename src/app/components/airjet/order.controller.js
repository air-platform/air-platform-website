/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderController', orderController);

    /** @ngInject */
    function orderController($scope,iotUtil) {
        var queryData = myApp.views[0].activePage.query;
        if(queryData.order) {
            $scope.order = queryData.order;
        }
    }
})();