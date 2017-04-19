/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelInfoController', travelInfoController);

    /** @ngInject */
    function travelInfoController($scope, NotificationService, StorageService) {
        $scope.infoData = {};
        $scope.infoSubmit = infoSubmit;

        function infoSubmit(data) {
            if(!data.name){
                NotificationService.alert.success('请填写姓名', null);
                return;
            }
            if(!data.phone){
                NotificationService.alert.success('请填写电话', null);
                return;
            }
            if(!data.email){
                NotificationService.alert.success('请填写邮箱', null);
                return;
            }
            var transferData = StorageService.get('plan');
            transferData.info = data;
            transferData.order = Math.floor(Math.random () * 999999999999);
            StorageService.put('plan', transferData);
            mainView.router.loadPage('app/components/airjet/travel-detail.html');
        };
        
    }
})();