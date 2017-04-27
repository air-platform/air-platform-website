/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelInfoController', travelInfoController);

    /** @ngInject */
    function travelInfoController($scope, constdata, NotificationService, StorageService, NetworkService, UrlService, URL, REGEX) {
        $scope.infoData = {};
        $scope.infoSubmit = infoSubmit;

        var information = StorageService.get(constdata.information);
        if (information){
            $scope.infoData = {name:information.realName,phone:information.mobile,email:information.email};
        }
        $scope.telephone = 'tel:' + constdata.supportTelephone;

        function infoSubmit(data) {
            if(!data.name){
                NotificationService.alert.success('请填写姓名', null);
                return;
            }
            if(!data.phone){
                NotificationService.alert.success('请填写手机号', null);
                return;
            }
            if(!REGEX.PHONE.test(data.phone)) {
                NotificationService.alert.success('手机号不正确', null);
                return;
            }
            if(!data.email){
                NotificationService.alert.success('请填写邮箱', null);
                return;
            }
            if(!REGEX.EMAIL.test(data.email)) {
                NotificationService.alert.success('邮箱格式不正确', null);
                return;
            }
            if(!$scope.agreement){
                NotificationService.alert.success('请您先阅读并同意Air Community免责条款', null);
                return;
            }
            var transferData = StorageService.get(constdata.cookie.airjet.travel);
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
                StorageService.remove(constdata.cookie.airjet.travel);
                StorageService.remove(constdata.cookie.airjet.travel_base);
                var local = response.headers('location').split('/');
                mainView.router.loadPage('app/components/airjet/order-success.html?order=' + local[local.length - 1]);
            }, function() {
                NotificationService.alert.success('提交订单失败', null);
            });
        };
        
    }
})();