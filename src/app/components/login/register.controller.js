/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('registerController', registerController);

    /** @ngInject */
    function registerController($scope,NetworkService,$interval,iotUtil) {

        $scope.mobile = '';
        $scope.password = '';
        $scope.authcode = '';
        $scope.confirm_password = '';

        $scope.authcodetip = '获取验证码';
        $scope.authcodediabled = false;

        $scope.agreement = false;

        $scope.gotoAnnounceAction = gotoAnnounceAction;
        $scope.backAction = backAction;
        $scope.registerAction = registerAction;
        $scope.getAuthcode = getAuthcode;

        var countDown = 120;
        var timer;

        // 获取 f7 页面
        // var page = myApp.views[0];
        // var pageContainer = $$(page.container);
        // var username = pageContainer.find('input[name="username"]').val();
        // var authcode = pageContainer.find('input[name="auth"]').val();
        // var password = pageContainer.find('input[name="password"]').val();


        function backAction() {
            mainView.router.back();
        }

        function getAuthcode() {
            $scope.authcodediabled = true;
            myApp.showIndicator();
            NetworkService.post('account/verification?mobile=' + $scope.mobile,null,function (res) {
                myApp.hideIndicator();
                countDown = 120;
                timer = $interval($scope.upd_count ,1000,120);
                myApp.alert('验证码发送成功，请注意查收！', function () {

                });
            },function (err) {
                $scope.authcodediabled = false;
                var errDesc = err.statusText;
                myApp.hideIndicator();
                myApp.alert('操作失败！' + errDesc, null);
            });
        }
        
        function registerAction() {
            myApp.showIndicator();

            NetworkService.post('account',{mobile:$scope.mobile,verificationCode:$scope.authcode,password:$scope.password},function (res) {
                myApp.hideIndicator();
                myApp.alert('注册成功！', 'Air Community', function () {
                    mainView.router.back();
                });
            },function (err) {
                var errDesc = err.statusText;
                myApp.hideIndicator();
                myApp.alert('操作失败！' + errDesc, null);
            });
            
        }

        function gotoAnnounceAction() {
            mainView.router.loadPage(constdata.router.protocal.announce);
        }




        $scope.upd_count = function () {
            countDown = countDown - 1;
            if (countDown <= 0){
                $scope.authcodediabled = false;
                $scope.authcodetip = '获取验证码';
            }else{
                $scope.authcodetip = countDown + '秒后重试';
            }
        };
        $scope.$on('$destroy',function(){
            $interval.cancel(timer);
        });



    }

})();