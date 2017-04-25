/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelDetailController', travelDetailController);

    /** @ngInject */
    function travelDetailController($scope, $timeout, NotificationService, StorageService, NetworkService, UrlService, URL, constdata) {
        var queryData = myApp.views[0].activePage.query;
        var transferData = StorageService.get('plan');


        $scope.telephone = 'tel:' + constdata.supportTelephone;

        $scope.removeOrder = removeOrder;

        if(queryData.order) {
            $timeout(function(){
                getOrder();
            }, 300);
        }

        function getOrder() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_ORDER) +  '/' + queryData.order, null, function(response) {
                $scope.detailData = response.data;
            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function removeOrder(data) {
            if(data.id) {
                myApp.confirm('你确定要删除该订单吗?', null, function () {
                     NetworkService.delete(UrlService.getUrl(URL.AIRJET_ORDER) +  '/' + data.id, null, function(response) {
                        myApp.alert('订单已删除', null, function(){
                            mainView.router.loadPage(constdata.router.airjet.travel);
                        });
                    }, function(){
                        myApp.alert('订单删除失败，请重试', null);
                    });
                });
            }
        }
    }
})();