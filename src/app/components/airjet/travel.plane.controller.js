/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelPlaneController', travelPlaneController);

    /** @ngInject */
    function travelPlaneController($scope, NotificationService, StorageService, NetworkService, UrlService, URL) {
        var page = 1;
        var transferData = StorageService.get('plan');
        var queryData = myApp.views[0].activePage.query;
        $scope.jumpInfo = jumpInfo;
        angular.element('.pull-to-refresh-content').on('refresh', getPlaneList);

        if(queryData.type){
            angular.element('#plane-title').text(queryData.type);
            getPlaneList();
        }
        if(queryData.id){
            getPlaneDetail();
        }

        function getPlaneList() {
            var data = {
                page: page,
                pageSize: 10,
                type: queryData.type
            };
            NetworkService.get(UrlService.getUrl(URL.AIRJET_PLANE), data, function(response) {
                $scope.planeList = response.data.content;
                console.log(response.data.content)
                if(response.data.totalPages > page){
                    page ++;
                }
                myApp.pullToRefreshDone();
            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function getPlaneDetail() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_PLANE) + '/' + queryData.id, null, function(response) {
                $scope.planeDetail = response.data;
                angular.element('#plane-detail-title').text(response.data.name);
                if(response.data.appearances) {
                    $scope.appearances = response.data.appearances.split(';');
                }
            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function jumpInfo(data) {
            var planeArr = [];
            if(data.every(function(item){
                return item.selected === false;
            })){
                NotificationService.alert.success('请至少选择一架飞机', null);
                return;
            }
            data.forEach(function(item){
                if(item.selected) {
                    planeArr.push({ fleet: item.id });
                }
            });
            transferData.plane = planeArr;
            StorageService.put('plan', transferData);
            console.log(transferData)
            mainView.router.loadPage('app/components/airjet/travel-info.html');
        };

    }
})();