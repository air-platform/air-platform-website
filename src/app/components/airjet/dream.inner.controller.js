/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('dreamInnerController', dreamInnerController);

    /** @ngInject */
    function dreamInnerController($scope, $timeout, NotificationService,StorageService, NetworkService,constdata, UrlService, URL, REGEX) {
        var queryData = myApp.views[0].activePage.query;
        $scope.formData = {};
        var information = StorageService.get(constdata.information);
        if(information){
            $scope.formData = {name:information.realName,phone:information.mobile,email:information.email};
        }
        $scope.telephone = 'tel:' + constdata.supportTelephone;

        $scope.submit = submit;
        if(queryData.id) {
            $timeout(function(){
                getDreamDetail();
            },300)
        }

        function getDreamDetail() {
             NetworkService.get(UrlService.getUrl(URL.AIRJET_DREAM) + '/' + queryData.id, null, function(response) {
                $scope.dreamObj = response.data;
                $scope.dreamImg = response.data.appearances.split(';');
                if($scope.dreamObj.timeSlot){
                    $scope.dreamObj.startTime = $scope.dreamObj.timeSlot.split('-')[0];
                    $scope.dreamObj.endTime = $scope.dreamObj.timeSlot.split('-')[1];
                }
                if($scope.dreamObj.minPassengers){
                    $scope.dreamObj.least = { number: $scope.dreamObj.minPassengers }
                }
            });
        };

        function submit(data) {
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
            if(!data.guest){
                NotificationService.alert.success('请填写乘客人数', null);
                return;
            }
            if(data.guest < $scope.dreamObj.minPassengers){
                NotificationService.alert.success('乘客人数至少大于等于' +　$scope.dreamObj.minPassengers, null);
                return;
            }
            if(!$scope.agreement){
                NotificationService.alert.success('请您先阅读并同意Air Community免责条款', null);
                return;
            }
            var passData = {
                "passengers": data.guest,
                "contact": {
                    "person": data.name,
                    "mobile": data.phone,
                    "email": data.email
                },
                "note": data.remark,
                "ferryFlight": $scope.dreamObj.id
            };

            NetworkService.post(UrlService.getUrl(URL.AIRJET_DREAM_ORDER), passData, function(response) {
                var local = response.headers('location').split('/');
                mainView.router.loadPage('app/components/airjet/order-success.html?page=dream-detail&order=' + local[local.length - 1]);
            }, function() {
                NotificationService.alert.success('提交订单失败', null);
            });
        };
    }

})();