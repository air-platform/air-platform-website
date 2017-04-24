/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('tourDetailController', tourDetailController);

    /** @ngInject */
    function tourDetailController($scope, $timeout, NotificationService, NetworkService, UrlService, URL, REGEX) {
        var queryData = myApp.views[0].activePage.query;
        $scope.tourData = {};
        $scope.submit = submit;
        if (queryData.id) {
            $timeout(function(){
                getTourDetail();
            }, 500);
        }

        function getTourDetail() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CARD) + '/' + queryData.id, null, function (response) {
                $scope.tourDetail = response.data;
                $scope.goodPoint = response.data.description.split('\n');
            });
        };

        function submit(data, id) {
            if (!data.name) {
                NotificationService.alert.success('请填写姓名', null);
                return;
            }
            if (!data.phone) {
                NotificationService.alert.success('请填写手机号', null);
                return;
            }
            if(!REGEX.PHONE.test(data.phone)) {
                NotificationService.alert.success('手机号不正确', null);
                return;
            }
            if (!data.email) {
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
 
            if (data) {
                var passData = {
                    "contact": {
                        "person": data.name,
                        "mobile": data.phone,
                        "email": data.email
                    },
                    "note": data.remark,
                    "jetCard": id
                }
                NetworkService.post(UrlService.getUrl(URL.AIRJET_CARD_ORDER), passData, function (response) {
                    var local = response.headers('location').split('/');
                    mainView.router.loadPage('app/components/airjet/order-success.html?page=tour-order&order=' + local[local.length - 1]);
                }, function () {
                    NotificationService.alert.success('提交订单失败', null);
                });
            }
        };

    }
})();