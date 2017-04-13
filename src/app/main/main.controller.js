/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope, $rootScope,$translate,iotUtil,$timeout,NetworkService,constdata,StorageService) {


        var rightPanelItems = [
            {title:'profile.order',target:'app/components/login/login.html'},
            {title:'profile.setting',target:'app/components/profile/setting.html'}];
        var info = {};
        var loginItemTitle = '';

        $translate('profile.login-register').then(function (headline) {
            loginItemTitle = headline;
            $scope.rightUserItem = {title:loginItemTitle,target:'app/components/login/login.html'};
        }, function (translationId) {
            loginItemTitle = translationId;
            $scope.rightUserItem = {title:loginItemTitle,target:'app/components/login/login.html'};
        });

        $scope.rightPanelItems = rightPanelItems;
        $scope.gotoItemAction = gotoItemAction;


        // 订阅登录通知->刷新界面
        $rootScope.$on(constdata.notification_refresh_information, function (evt, data) {
            refresh();
        });

        refresh();




        function gotoItemAction(item) {
            if (item.target === 'out'){
                logoutAction();
            }else{
                if (iotUtil.islogin()){
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
                refresh();
            },60);
        }
        function refresh() {
            if (iotUtil.islogin()){
                info = iotUtil.userInfo();
                $scope.rightUserItem.title = info.nickName;
                $scope.rightUserItem.target = 'app/components/login/login.html';
                $scope.rightPanelItems.push({title:'profile.out',target:'out'});
            }else{
                info = {};
                $scope.rightUserItem = {title:loginItemTitle,target:'app/components/login/login.html'};
            }
        }






        var page = myApp.views[0];
        var pageContainer = $$(page.container);
        var ul = pageContainer.find('.news-text');

        $scope.imgSrc = [
            './../assets/images/banner0.jpg',
            './../assets/images/banner1.jpg',
            './../assets/images/banner0.jpg'
        ];

        $scope.addLi = function(listNew) {
            var li = '<li><a href="#">';
            li += listNew;
            li += '</a></li>';
            ul.append(li);
        }

        $scope.listNews = [
            '#最美航线大PK#',
            '#【原创】请问徐闻zhih到海口的直升机多长时间一班#',
            '#【原创】飞机飞到哪里去啊#'
        ]

        for (var i = 0; i < $scope.listNews.length; i++) {
            $scope.addLi($scope.listNews[i]);
        }

        function test() {
            NetworkService.get('account/auth',null, function(res) {
                console.log(res);
            }, function(err) {
                console.log(err);
            });
        }

    }

})();