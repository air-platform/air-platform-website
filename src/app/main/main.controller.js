/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope, $rootScope, NotificationService, iotUtil, $timeout, NetworkService, UrlService, URL, constdata, StorageService) {

        $rootScope.gotoAnnounceAction = gotoAnnounceAction; // 安全须知和免责声明
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
            }else{
                refresh();
            }
        });

        $scope.airbbLink = constdata.ipCurrent + '/airbb';

        var leftPanelItems = [
            {
                title: 'Air Jet', items: [
                {'title': '包机预定', target: constdata.router.airjet.home + '?type=1'},
                {'title': '缘梦飞行', target: constdata.router.airjet.home + '?tabActive=tab2'},
                {'title': '卡产品', target: constdata.router.airjet.home + '?tabActive=tab3'}
            ]
            },
            {
                title: 'Air Taxi', items: [
                {'title': '空中观光', target: constdata.router.airtaxi.home + '?type=1'}
            ]
            },
            {
                title: 'Air Transportation', items: [
                {'title': '海峡飞行', target: constdata.router.airtrans.home + '?type=1'},
                {'title': '内蒙航线', target: constdata.router.airtrans.home + '?type=2'}
            ]
            },
            {
                title: '飞行培训', items: [
                {'title': '航校信息', target: constdata.router.airtrain.home + '?type=1'},
                {'title': '预定培训', target: constdata.router.airtrain.home + '?type=2'}
            ]
            },
            {
                title: 'Air Quest', items: [
                {'title': '话题讨论/发帖/留言', target: 'forum'}
            ]
            },
            {
                title: '会员中心', items: [
                // {'title': '用户注册/登录', target: constdata.router.login.login},
                {'title': '订单查询', target: constdata.router.order.order}
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

        function gotoAnnounceAction(type) {
            $scope.agreement = false;
            if (1 === type){
                mainView.router.loadPage(constdata.router.protocal.announce);
            }else{
                mainView.router.loadPage(constdata.router.protocal.safehelicopter);
            }
        }

        function gotoItemAction(item) {
            if (item.target === 'out') {
                logoutAction();
            }else if (item.target === 'forum'){
                window.open('http://10.70.80.92/airbb',"_blank");
            }else {
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
        function pleaseReComeIn() {
            StorageService.clear(constdata.token);
            StorageService.clear(constdata.information);
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
            'assets/images/index/banner.png'
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
