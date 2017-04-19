/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelInfoController', travelInfoController);

    /** @ngInject */
    function travelInfoController($scope, NotificationService, StorageService, NetworkService, UrlService, URL) {
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
            var params = {
                "contact": {
                    "person": data.name,
                    "mobile": data.phone,
                    "email": data.email
                },
                "note": data.remark,
                "flightLegs": transferData.base,
                "fleetCandidates": transferData.plane
            }
            NetworkService.post(UrlService.getUrl(URL.AIRJET_ORDER), params, function(response) {
                var local = response.headers('location').split('/');
                mainView.router.loadPage('app/components/airjet/order-success.html?order=' + local[local.length - 1]);
            }, function() {
                mainView.router.loadPage('app/components/airjet/order-fail.html')
            });
        };
        
    }
})();