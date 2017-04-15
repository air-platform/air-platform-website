/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelDetailController', travelDetailController);

    /** @ngInject */
    function travelDetailController($scope,iotUtil) {
        var queryData = myApp.views[0].activePage.query;
        if(queryData.info) {
            $scope.userInfo = JSON.parse(queryData.info);
        }

    }

})();