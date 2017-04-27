/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope, $rootScope, NotificationService, iotUtil, $cookieStore, NetworkService, UrlService, URL, constdata, StorageService) {

        $rootScope.gotoAnnounceAction = gotoAnnounceAction; // 须知和免责声明
        $scope.gotoAirbbLinkAction = gotoAirbbLinkAction;

        // 订阅登录通知->刷新界面
        $rootScope.$on(constdata.notification_refresh_information, function (evt, data) {
            if (data.action === 'logout'){
                if (iotUtil.islogin()){
                    myApp.alert('登录过期，请重新登录',function () {
                        pleaseReComeIn();
                    });
                }else{
                    myApp.alert('请先登录',function () {
                        pleaseReComeIn();
                    });
                }
            }else if(data.action === 'login'){
                myApp.alert('请先登录',function () {
                    pleaseReComeIn();
                });
            } else{
                refresh();
            }
        });

        $scope.airbbLink = constdata.ipCurrent;

        var leftPanelItems = [
            {
                title: '空中专车',
                subtitle:'Air Jet', items: [
                {'title': '旅行计划', target: constdata.router.airjet.travel},
                {'title': '缘梦飞行', target: constdata.router.airjet.dream},
                {'title': '卡产品', target: constdata.router.airjet.card}
            ]
            },
            {
                title: '空中出租',
                subtitle:'Air Taxi', items: [
                {'title': '空中观光', target: constdata.router.airtaxi.home + '?type=1'}
            ]
            },
            {
                title: '空中快车',
                subtitle: 'Air Transportation', items: [
                {'title': '海峡飞行', target: constdata.router.airtrans.cross},
                {'title': '内蒙航线', target: constdata.router.airtrans.mongolia}
            ]
            },
            {
                title: '飞行培训',
                subtitle: 'Air Training', items: [
                {'title': '航校信息', target: constdata.router.airtrain.home + '?type=1'},
                {'title': '预定培训', target: constdata.router.airtrain.home + '?type=schoollist'}
            ]
            },
            {
                title: '空中论坛',
                subtitle: 'Air Quest', items: [
                {'title': '话题讨论/发帖/留言', target: 'forum'}
            ]
            },
            {
                title: '会员中心',
                subtitle: '', items: [
                // {'title': '用户注册/登录', target: constdata.router.login.login},
                {'title': '订单查询', target: constdata.router.order.order,needLogin:true}
                // {'title': '积分系统', target: ''}
            ]
            },
            {
                title: '关于', items: [
                // {'title': '用户注册/登录', target: constdata.router.login.login},
                {'title': '免责声明', target: constdata.router.protocal.announce}
                // {'title': '积分系统', target: ''}
            ]
            }];
        var rightPanelItems = [
            {needLogin:true,title: 'profile.order', target: constdata.router.order.order, icon: 'list'},
            {needLogin:true,title: 'profile.setting', target: constdata.router.set.setting, icon: 'gear'},
            {needLogin:true,title: 'profile.out', target: 'out', icon: 'logout'}];
        var info = {};
        var loginItemTitle = '登录/注册';

        $scope.islogin = false;
        $scope.rightPanelItems = rightPanelItems;
        $scope.leftPanelItems = leftPanelItems;
        $scope.rightUserItem = {needLogin:true,title: loginItemTitle, target: constdata.router.login.login, icon: 'person'};
        $scope.gotoItemAction = gotoItemAction;


        refresh();

        function gotoAnnounceAction(type) {
            $scope.agreement = false;
            if (1 === type){
                mainView.router.loadPage(constdata.router.protocal.announce);
            }else{
                mainView.router.loadPage(constdata.router.protocal.safehelicopter);
            }
        }
        function gotoAirbbLinkAction() {
            window.open($scope.airbbLink,'_parent');
        }

        function gotoItemAction(item) {
            if (item.target === 'out') {
                logoutAction();
            }else if (item.target === 'forum'){
                window.open($scope.airbbLink,"_parent");
            }else {
                if (item.needLogin && !iotUtil.islogin()) {
                    mainView.router.loadPage($scope.rightUserItem.target);
                } else {
                    mainView.router.loadPage(item.target);
                }
            }
        }

        function logoutAction() {
            StorageService.clear(constdata.token);
            StorageService.clear(constdata.information);
            console.log($cookieStore.get('token'));
            $cookieStore.remove("token");
            console.log($cookieStore.get('token'));
            for(var key in constdata.cookie) {
                if(angular.isObject(constdata.cookie[key])){
                    for(var i in constdata.cookie[key]) {
                        StorageService.clear(constdata.cookie[key][i]);
                    }
                } else {
                    StorageService.clear(constdata.cookie[key]);
                }
            }
            refresh();
            myApp.alert('退出成功！');
        }
        function pleaseReComeIn() {
            StorageService.clear(constdata.token);
            StorageService.clear(constdata.information);
            for(var key in constdata.cookie) {
                if(angular.isObject(constdata.cookie[key])){
                    for(var i in constdata.cookie[key]) {
                        StorageService.clear(constdata.cookie[key][i]);
                    }
                } else {
                    StorageService.clear(constdata.cookie[key]);
                }
            }
            StorageService.clear('tabActive');
            refresh();
            mainView.router.loadPage(constdata.router.login.login);
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
            'assets/images/index/banner1.png',
            'assets/images/index/banner2.png',
            'assets/images/index/banner3.png'
        ];

        NetworkService.get(UrlService.getUrl(URL.TOPICS), null, function(res) {
            $scope.listNews = res.data;
        }, function(err) {
            showErrorAlert(err);
        });

        function showErrorAlert(err) {
            var errDesc = err.statusText;
            NotificationService.alert.error('操作失败！' + errDesc, null);
        }

        function test() {
            NetworkService.get('account/auth', null, function (res) {
                console.log(res);
            }, function (err) {
                console.log(err);
            });
        }
    }
})();
