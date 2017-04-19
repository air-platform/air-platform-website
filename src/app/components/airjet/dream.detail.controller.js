/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('dreamDetailController', dreamDetailController);

    /** @ngInject */
    function dreamDetailController($scope, NotificationService) {
        var queryData = myApp.views[0].activePage.query;
        $scope.submit = submit;
        if(queryData.dreamdata) {
            $scope.dreamData = JSON.parse(queryData.dreamdata);
        }
        $scope.detailData = {
            order: 993028364001,
            model: '金鹿航空 BBJ-002',
            date: '2017年04月07日 周六',
            startCity: '香港',
            startTime: '13:00',
            startLocal: '首都机场T2航站楼',
            endCity: '北京',
            endTime: '16:30',
            endLocal: '美兰机场',
            passenger: '3',
            remark: $scope.dreamData.remark
        }

        function submit(data) {
            if(data){
                mainView.router.loadPage('app/components/airjet/order-success.html');
            } else {
                mainView.router.loadPage('app/components/airjet/order-fail.html')
            }
        }

    }

})();