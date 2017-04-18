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
    function loginController($scope,NetworkService,StorageService,constdata,$rootScope,NotificationService, UrlService, URL,$timeout, ValidatorService) {


        $scope.principal = '';
        $scope.credential = '';

        $scope.cancelAction = cancelAction;
        $scope.signinAction = signinAction;
        $scope.gotoRegister = gotoRegister;
        $scope.gotoResetPassword = gotoResetPassword;

        function cancelAction() {
            mainView.router.back();
        }

        function signinAction() {
            // console.log(ValidatorService.validate.checkPassword.call(null, $scope.credential), 'password');
            myApp.showIndicator();
            NetworkService.post(UrlService.getUrl(URL.LOGIN), {principal:$scope.principal,credential:$scope.credential},function (response) {

                //保存token到本地
                var token = response.data.token;
                StorageService.put(constdata.token,token,24 * 3 * 60 * 60);//3 天过期

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
                var userInfo = {nickName:data.nickName,avatar:data.avatar,id:data.id,realName:data.realName,city:data.city,birthday:data.birthday};

                StorageService.put(constdata.information,userInfo,24 * 7 * 60 * 60);//3 天过期

                //通知刷新界面
                $rootScope.$emit(constdata.notification_refresh_information,userInfo);

                myApp.hideIndicator();
                myApp.alert('登录成功！', function () {
                    mainView.router.back();
                });

            },function (err) {
                myApp.hideIndicator();
                showErrorAlert(err);
            });
        }
        function showErrorAlert(err) {
            var errDesc = err.statusText;
            NotificationService.alert.error('操作失败！' + errDesc, null)
        }
        function gotoRegister() {
            mainView.router.loadPage('app/components/login/register.html');
        }
        function gotoResetPassword() {
            mainView.router.loadPage('app/components/login/reset.html');
        }
        

    }

})();