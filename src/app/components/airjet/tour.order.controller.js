/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('tourOrederController', tourOrederController);

    /** @ngInject */
    function tourOrederController($scope, $timeout, NotificationService, StorageService, NetworkService, UrlService, URL, constdata) {
        var queryData = myApp.views[0].activePage.query;
        var transferData = StorageService.get('plan');

        if(queryData.order) {
            $timeout(function(){
                getOrder();
            }, 200);
        }

        function getOrder() {
            NetworkService.get(UrlService.getUrl(URL.ORDER) +  '/' + queryData.order, null, function(response) {
                $scope.detailData = response.data;
            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };
    }
})();