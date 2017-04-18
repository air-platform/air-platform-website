/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope, $rootScope, $translate, iotUtil, $timeout, NetworkService, constdata, StorageService) {

        // 订阅登录通知->刷新界面
        $rootScope.$on(constdata.notification_refresh_information, function (evt, data) {
            refresh();
        });

        var leftPanelItems = [
            {
                title: 'Air Jet', items: [
                {'title': '包机预定', target: constdata.router.airjet.home},
                {'title': '缘梦飞行', target: constdata.router.airjet.home},
                {'title': '卡产品', target: constdata.router.airjet.home}
            ]
            },
            {
                title: 'Air Taxi', items: [
                {'title': '空中观光', target: constdata.router.airtaxi.home}
            ]
            },
            {
                title: 'Air Transportation', items: [
                {'title': '海峡飞行', target: constdata.router.airtrans.home},
                {'title': '内蒙航线', target: constdata.router.airtrans.home}
            ]
            },
            {
                title: '飞行培训', items: [
                {'title': '航校信息', target: constdata.router.airtrain.home},
                {'title': '预定培训', target: constdata.router.airtrain.home}
            ]
            },
            {
                title: 'Air BB论坛', items: [
                {'title': '话题讨论/发帖/留言', target: ''}
            ]
            },
            {
                title: '会员中心', items: [
                {'title': '用户注册/登录', target: constdata.router.login.login},
                {'title': '订单查询', target: constdata.router.order.order},
                {'title': '积分系统', target: ''}
            ]
            }];
        var rightPanelItems = [
            {title: 'profile.order', target: constdata.router.order.order, icon: 'list'},
            {title: 'profile.setting', target: constdata.router.set.setting, icon: 'gear'},
            {title: 'profile.out', target: 'out', icon: 'logout'}];
        var info = {};
        var loginItemTitle = '登录/注册';

        $scope.islogin = false;
        $scope.rightPanelItems = rightPanelItems;
        $scope.leftPanelItems = leftPanelItems;
        $scope.rightUserItem = {title: loginItemTitle, target: constdata.router.login.login, icon: 'person'};
        $scope.gotoItemAction = gotoItemAction;


        refresh();

        function gotoItemAction(item) {
            if (item.target === 'out') {
                logoutAction();
            } else {
                if (iotUtil.islogin()) {
                    mainView.router.loadPage(item.target);
                } else {
                    mainView.router.loadPage($scope.rightUserItem.target);
                }
            }
        }

        function logoutAction() {
            StorageService.clear(constdata.token);
            StorageService.clear(constdata.information);
            refresh();
            myApp.alert('退出成功！');
        }

        function refresh() {
            if (iotUtil.islogin()) {
                info = iotUtil.userInfo();
                $scope.islogin = true;
                $scope.rightUserItem.title = info.nickName;
                $scope.rightUserItem.target = constdata.router.set.profile;
            } else {
                info = {};
                $scope.islogin = false;
                $scope.rightUserItem.title = loginItemTitle;
                $scope.rightUserItem.target = constdata.router.login.login;
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
        ];

        function test() {
            NetworkService.get('account/auth', null, function (res) {
                console.log(res);
            }, function (err) {
                console.log(err);
            });
        }
    }
})();
