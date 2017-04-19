/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('tourDetailController', tourDetailController);

    /** @ngInject */
    function tourDetailController($scope, NotificationService, NetworkService, UrlService, URL) {
        var queryData = myApp.views[0].activePage.query;
        $scope.tourData = {};
        $scope.submit = submit;
        if(queryData.id) {
            getTourDetail();
        }

        function getTourDetail() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CARD) + '/' + queryData.id, null, function(response) {
                $scope.tourDetail = response.data;
            });
        };

        function submit(data){
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
            if(!data.guest){
                NotificationService.alert.success('请填写客户名称', null);
                return;
            }
            if(data){
                mainView.router.loadPage('app/components/airjet/order-success.html');
            } else {
                mainView.router.loadPage('app/components/airjet/order-fail.html')
            }
        }

    }
})();