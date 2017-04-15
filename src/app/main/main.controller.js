/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope, $rootScope,$translate,iotUtil,$timeout,NetworkService,constdata,StorageService) {

        // 订阅登录通知->刷新界面
        $rootScope.$on(constdata.notification_refresh_information, function (evt, data) {
            refresh();
        });

        var leftPanelItems = [
            {title:'Air Jet',items:[
                {'title':'包机预定'},
                {'title':'缘梦飞行'},
                {'title':'卡产品'}
                ]},
            {title:'Air Transportation',items:[
                {'title':'空中观光'}]},
            {title:'Air Transportation',items:[
                {'title':'海峡飞行'},
                {'title':'内蒙航线'}
                ]},
            {title:'飞行培训',items:[
                {'title':'航校信息'},
                {'title':'预定培训'}
                ]},
            {title:'Air BB论坛',items:[
                {'title':'话题讨论/发帖/留言'}
                ]},
            {title:'会员中心',items:[
                {'title':'用户注册/登录'},
                {'title':'订单查询'},
                {'title':'积分系统'}
                ]}];
        var rightPanelItems = [
            {title:'profile.order',target:'app/components/order/order.html',icon:'list'},
            {title:'profile.setting',target:'app/components/setting/setting.html',icon:'gear'},
            {title:'profile.out',target:'out',icon:'logout'}];
        var info = {};
        var loginItemTitle = '登录/注册';

        $scope.islogin = false;
        $scope.rightPanelItems = rightPanelItems;
        $scope.leftPanelItems = leftPanelItems;
        $scope.rightUserItem = {title:loginItemTitle,target:'app/components/login/login.html',icon:'person'};
        $scope.gotoItemAction = gotoItemAction;


        refresh();



        function gotoItemAction(item) {
            if (item.target === 'out'){
                logoutAction();
            }else{
                if (iotUtil.islogin()){  //iotUtil.islogin()
                    mainView.router.loadPage(item.target);
                }else {
                    mainView.router.loadPage($scope.rightUserItem.target);
                }
            }
        }
        function logoutAction() {
            $timeout(function () {
                StorageService.clear(constdata.token);
                StorageService.clear(constdata.information);
                myApp.alert('退出成功！', function () {
                    refresh();
                });
            },60);
        }
        function refresh() {
            if (iotUtil.islogin()){
                info = iotUtil.userInfo();
                $scope.islogin = true;
                $scope.rightUserItem.title = info.nickName;
                $scope.rightUserItem.target = 'app/components/profile/profile.html';
                $scope.rightUserItem.icon = 'person';
            }else{
                info = {};
                $scope.islogin = false;
                $scope.rightUserItem = {title:loginItemTitle,target:'app/components/login/login.html',icon:'person'};
            }
        }

        $scope.imgSrc = [
            './../assets/images/banner0.jpg',
            './../assets/images/banner1.jpg',
            './../assets/images/banner0.jpg'
        ];

        $scope.listNews = [
            '#最美航线大PK#',
            '#【原创】请问徐闻zhih到海口的直升机多长时间一班#',
            '#【原创】飞机飞到哪里去啊#'
        ]

        function test() {
            NetworkService.get('account/auth',null, function(res) {
                console.log(res);
            }, function(err) {
                console.log(err);
            });
        }
    }
})();
