/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('loginController', loginController);

    /** @ngInject */
    function loginController($scope,NetworkService,StorageService,$cookieStore,constdata,$rootScope,NotificationService, UrlService, URL,$timeout) {


        $scope.principal = '';
        $scope.credential = '';

        $scope.cancelAction = cancelAction;
        $scope.signinAction = signinAction;
        $scope.gotoRegister = gotoRegister;
        $scope.gotoResetPassword = gotoResetPassword;




        var fruits = StorageService.get(constdata.account_list);
        if (!fruits){
            fruits = [];
        }

        var autocompleteDropdownSimple = myApp.autocomplete({
            input: '#autocomplete-dropdown',
            openIn: 'dropdown',
            dropdownTemplate: '<div class="autocomplete-dropdown" style="box-shadow: none;border: none;"> ' +
                                    '<div class="autocomplete-dropdown-inner" style="margin-left: 0;"> ' +
                                        '<div class="list-block" style="margin: 0;"> ' +
                                            '<ul style="margin: 0 80px 0 0;"></ul> ' +
                                        '</div> ' +
                                    '</div>' +
                                    '{{#if preloader}} ' +
                                    '<div class="autocomplete-preloader preloader {{#if preloaderColor}}preloader-{{preloaderColor}}{{/if}}">' +
                                        '{{#if material}}{{materialPreloaderHtml}}{{/if}} ' +
                                    '</div>' +
                                        '{{/if}} ' +
                                '</div>',
            dropdownItemTemplate:'<li style="height: 40px;"> ' +
            '<label class="{{#unless placeholder}}label-radio{{/unless}} item-content" data-value="{{value}}"> ' +
            '<div class="item-inner"> ' +
            '<div class="item-title">{{text}}</div> ' +
            '</div> ' +
            '</label> ' +
            '</li>',
            source: function (autocomplete, query, render) {
                var results = [];
                if (query.length === 0) {
                    render(results);
                    return;
                }
                // Find matched items
                for (var i = 0; i < fruits.length; i++) {
                    if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
                }
                // Render items by passing array with result items
                render(results);
            }
        });






        function cancelAction() {
            mainView.router.loadPage('index.html');
        }

        function signinAction() {
            // console.log(ValidatorService.validate.checkPassword.call(null, $scope.credential), 'password');

            var isExist = fruits.indexOf($scope.principal);
            if (isExist === -1){
                fruits.splice(0,0,$scope.principal);
            }else {
                fruits.remove($scope.principal);
                fruits.splice(0,0,$scope.principal);
            }
            if (fruits.length > 5){
                fruits.splice(5,fruits.length - 5);
            }

            StorageService.put(constdata.account_list,fruits,24 * 30 * 60 * 60);


            myApp.showIndicator();
            NetworkService.post(UrlService.getUrl(URL.LOGIN), {principal:$scope.principal,credential:$scope.credential},function (response) {

                //保存token到本地
                var token = response.data.token;

                //设置cookie
                $cookieStore.put('token',token + ';Version=1;Domain=aircommunity.net;Path=/;Max-Age=86400;HttpOnly');

                console.log($cookieStore.get('token'));

                StorageService.put(constdata.token,token,24 * 3 * 60 * 60);//3 天过期

                $cookieStore.put('token', token);
                $cookieStore.put('Domain', location.host);
                $cookieStore.put('HttpOnly', null);

                $timeout(function () {
                    getProfileInfo();
                },300);

            },function (err) {
                myApp.hideIndicator();
                showErrorAlert(err);
            });

        }
        function getProfileInfo() {
            NetworkService.get(UrlService.getUrl(URL.PROFILE), null,function (response) {

                var data = response.data;
                var userInfo = {nickName:data.nickName,mobile:data.mobile,avatar:data.avatar,email:data.email,id:data.id,realName:data.realName,city:data.city,birthday:data.birthday};

                StorageService.put(constdata.information,userInfo,24 * 7 * 60 * 60);//7 天过期

                //通知刷新界面
                $rootScope.$emit(constdata.notification_refresh_information,userInfo);

                // myApp.alert('登录成功！', function () {
                //     mainView.router.back();
                // });
                $timeout(function () {
                    myApp.hideIndicator();
                    mainView.router.back();
                },500);

            },function (err) {
                myApp.hideIndicator();
                showErrorAlert(err);
            });
        }
        function showErrorAlert(err) {
            var errDesc = err.statusText;
            if (err.status === 401){
                errDesc = "用户名或密码错误";
            }

            NotificationService.alert.error('操作失败！' + errDesc, null);
        }
        function gotoRegister() {
            mainView.router.loadPage('app/components/login/register.html');
        }
        function gotoResetPassword() {
            mainView.router.loadPage('app/components/login/reset.html');
        }
        

    }

})();