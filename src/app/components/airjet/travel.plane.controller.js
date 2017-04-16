/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelPlaneController', travelPlaneController);

    /** @ngInject */
    function travelPlaneController($scope, NotificationService) {
        var queryData = myApp.views[0].activePage.query;
        angular.element('#plane-title').text(queryData.type);
        angular.element('#plane-detail-title').text(queryData.name);
        $scope.jumpInfo = jumpInfo;
        $scope.imgSrc = [
            'assets/images/travel/timg.jpeg',
            'assets/images/travel/timg.jpeg',
            'assets/images/travel/timg.jpeg'
        ];

        $scope.planeList = [{
            id: '1',
            selected: false,
            logo: 'assets/images/plane.png',
            name: '金鹿公务机',
            type: 'GX01102',
            money: '¥83万'
        },{
            id: '2',
            selected: false,
            logo: 'assets/images/plane.png',
            name: '金鹿公务机',
            type: 'GX01102',
            money: '¥83万'
        },{
            id: '3',
            selected: false,
            logo: 'assets/images/plane.png',
            name: '金鹿公务机',
            type: 'GX01102',
            money: '¥83万'
        },{
            id: '4',
            selected: false,
            logo: 'assets/images/plane.png',
            name: '金鹿公务机',
            type: 'GX01102',
            money: '¥83万'
        },{
            id: '5',
            selected: false,
            logo: 'assets/images/plane.png',
            name: '金鹿公务机',
            type: 'GX01102',
            money: '¥83万'
        },{
            id: '6',
            selected: false,
            logo: 'assets/images/plane.png',
            name: '金鹿公务机',
            type: 'GX01102',
            money: '¥83万'
        }];

        function jumpInfo(data) {
            var planeArr = [];
            if(data.every(function(item){
                return item.selected === false;
            })){
                NotificationService.alert.success('请至少选择一架飞机', null);
                return;
            }
            data.forEach(function(item){
                if(item.selected) {
                    planeArr.push(item.name);
                }
            });
            mainView.router.loadPage('app/components/airjet/travel-info.html?planearr=' + planeArr.toString());
        };

    }
})();