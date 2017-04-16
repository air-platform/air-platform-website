/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelInfoController', travelInfoController);

    /** @ngInject */
    function travelInfoController($scope, NotificationService) {
        var queryData = myApp.views[0].activePage.query;
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
            var formData = JSON.parse(queryData.jetdata);
            formData.info = data;
            formData.order = Math.floor(Math.random () * 999999999999);
            mainView.router.loadPage('app/components/airjet/travel-detail.html?jetdata=' + JSON.stringify(formData));
        };
        
    }
})();