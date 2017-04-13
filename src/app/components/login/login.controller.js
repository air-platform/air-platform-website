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
    function loginController($scope,NetworkService,iotUtil, NotificationService, UrlService, URL, ValidatorService) {


        $scope.principal = '';
        $scope.credential = '';

        $scope.cancelAction = cancelAction;
        $scope.signinAction = signinAction;
        $scope.gotoRegister = gotoRegister;
        $scope.gotoResetPassword = gotoResetPassword;


        // 获取 f7 页面
        // var page = myApp.views[0];
        // var page = myApp.getCurrentView();
        // console.log(page.activePage);
        // var pageContainer = $$(page.container);
        // var username = pageContainer.find('input[name="username"]').val();
        // var password = pageContainer.find('input[name="password"]').val();


        function cancelAction() {
            mainView.router.back();
        }

        function signinAction() {
            // console.log(ValidatorService.validate.checkPassword.call(null, $scope.credential), 'password');
            myApp.showIndicator();
            NetworkService.post(UrlService.getUrl(URL.LOGIN), {principal:$scope.principal,credential:$scope.credential},function (res) {

                console.log(res);
                myApp.hideIndicator();
                myApp.alert('登录成功！', 'Air Community', function () {
                    mainView.router.back();
                });

            },function (err) {

                var errDesc = err.statusText;
                myApp.hideIndicator();
                NotificationService.alert.error('操作失败！' + errDesc, null)

            });

        }
        function gotoRegister() {
            mainView.router.loadPage('app/components/login/register.html');
        }
        function gotoResetPassword() {
            mainView.router.loadPage('app/components/login/reset.html');
        }

    }

})();