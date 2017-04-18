/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelPlaneController', travelPlaneController);

    /** @ngInject */
    function travelPlaneController($scope, NotificationService) {
        var queryData = myApp.views[0].activePage.query;
        if(queryData.jetdata){
            angular.element('#plane-title').text(JSON.parse(queryData.jetdata).type);
        }
        if(queryData.name){
            angular.element('#plane-detail-title').text(queryData.name);
        }
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

        $scope.planeDetail = {
            id: '1',
            selected: false,
            logo: 'assets/images/plane.png',
            name: '金鹿公务机',
            type: 'GX01102',
            model:'湾流G550',
            range:'9500km',
            trunk:'1334kg',
            fleet:'湾流G550公务机是国际顶级远程喷气式公务机代表机型之一，是人类飞行史上首架直航范围能从纽约直达东京的超远程公务飞机，也是目前国内航程最远、性能最优、客舱最宽敞、舒适性最好的豪华公务机。',
            max:'18～20',
            bed:'2个',
            age:'12.5年',
            device:'客舱娱乐系统包括AIRSHOW系统，3部DVD，3部磁带播放器，客舱前部右侧装有一个20寸LED显示器，客舱中部两个区右前位置和左前位置各设有一个20存LED显示器。每个座位上安置一个10寸LED显示器。机舱内共有6部卫星电话。厨房有咖啡机3台，热水杯2只，冰箱2台，冷风箱2台，烤箱2台，微波炉3台。',
            tags: ['WIFI', '飞机餐', '微波炉'],
            money: '¥83万'
        };

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
            var formData = JSON.parse(queryData.jetdata);
            formData.plane = planeArr;
            mainView.router.loadPage('app/components/airjet/travel-info.html?jetdata=' + JSON.stringify(formData));
        };

    }
})();