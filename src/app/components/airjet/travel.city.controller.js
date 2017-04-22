/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelCityController', travelCityController);

    /** @ngInject */
    function travelCityController($scope, $timeout, NotificationService, StorageService, NetworkService, UrlService, URL, constdata) {
        var current = 1;
        var loading = false;
        $scope.page = 20;
        $scope.search = '';
        $scope.select = select;
        $timeout(function(){
            getCity();
        }, 200);
        angular.element('.infinite-scroll').on('infinite', infinite);
        $scope.$watch('search', search);

        function search(newValue, oldValue){
            $scope.page = 20;
            if(newValue !== oldValue) {
                $scope.searchList = [];
                $scope.cityList.forEach(function(item){
                    for(var key in item){
                        if(key !== 'id' && key !== '$$hashKey' && item[key] && angular.lowercase(item[key]).indexOf(angular.lowercase(newValue)) !== -1){
                            $scope.searchList.push(item);
                            return;
                        }
                    }
                });
            }
            if ($scope.searchList) {
                $scope.totalRecords = $scope.searchList.length;
                if ($scope.page >= $scope.totalRecords) {
                    myApp.detachInfiniteScroll(angular.element('.infinite-scroll'));
                    angular.element('.infinite-scroll-preloader').remove();
                }
            }
        };

        function infinite() {
            if (loading) return;
            loading = true;
            $timeout(function () {
                loading = false;
                if ($scope.page >= $scope.totalRecords) {
                    myApp.detachInfiniteScroll(angular.element('.infinite-scroll'));
                    angular.element('.infinite-scroll-preloader').remove();
                    return;
                }
                current ++;
                $scope.page = 20 * current;
            }, 1000);
        }

        function select(item){
            localStorage.city = item.city;
            mainView.router.back();
        };

        function getCity() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CITY), null, function(response) {
                $scope.cityList = response.data.content;
                $scope.cityList.map(function(item){
                    if(item.name.indexOf('机场') === -1){
                        return item.name += '机场';
                    }
                })
                $scope.totalRecords = response.data.totalRecords;
            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };
    }

})();