/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('dreamDetailController', dreamDetailController);

    /** @ngInject */
    function dreamDetailController($scope, $timeout, NotificationService, NetworkService, UrlService, URL) {
        var queryData = myApp.views[0].activePage.query;
        if(queryData.order) {
            $timeout(function(){
                getDreamOrder();
            },200);
        }

        function getDreamOrder() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_DREAM_ORDER) + '/' + queryData.order, null, function(response) {
                $scope.detailData = response.data;
                if($scope.detailData.ferryFlight.timeSlot){
                    $scope.detailData.ferryFlight.startTime = $scope.detailData.ferryFlight.timeSlot.split('-')[0];
                    $scope.detailData.ferryFlight.endTime = $scope.detailData.ferryFlight.timeSlot.split('-')[1];
                }
            });
        };

    }

})();