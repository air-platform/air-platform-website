/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelModelController', travelModelController);

    /** @ngInject */
    function travelModelController($scope, StorageService, NetworkService, UrlService, URL) {
        $scope.modelData = {};
        $scope.radioCheck = radioCheck;
        $scope.jumpPlane = jumpPlane;
        getModel();

        function getModel() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_TYPE), null, function(response) {
                $scope.modelList = response.data;
                $scope.checkModel = $scope.modelList[0].type;
            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function radioCheck(model) {
            $scope.checkModel = model.type;
        };

        function jumpPlane() {
            if($scope.checkModel){
                mainView.router.loadPage('app/components/airjet/travel-plane.html?type=' + $scope.checkModel);
            }
        };

    }
})();