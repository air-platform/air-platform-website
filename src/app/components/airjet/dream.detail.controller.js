/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('dreamDetailController', dreamDetailController);

    /** @ngInject */
    function dreamDetailController($scope, $timeout, NotificationService, NetworkService, UrlService, URL, constdata) {
        var queryData = myApp.views[0].activePage.query;
        $scope.removeOrder = removeOrder;
        if(queryData.order) {
            $timeout(function(){
                getDreamOrder();
            },300);
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

        function removeOrder(data) {
            if(data.id) {
                myApp.confirm('你确定要删除该订单吗?', null, function () {
                     NetworkService.delete(UrlService.getUrl(URL.AIRJET_DREAM_ORDER) +  '/' + data.id, null, function(response) {
                        myApp.alert('订单已删除', null, function(){
                            mainView.router.loadPage(constdata.router.airjet.dream);
                        });
                    }, function(){
                        myApp.alert('订单删除失败，请重试', null);
                    });
                });
            }
        }

    }

})();