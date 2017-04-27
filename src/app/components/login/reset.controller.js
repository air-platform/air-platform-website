/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('resetController', resetController);

    /** @ngInject */
    function resetController($scope,NetworkService,$interval,REGEX) {

        $scope.mobile = '';
        $scope.password = '';
        $scope.authcode = '';
        $scope.confirm_password = '';

        $scope.authcodetip = '获取验证码';
        $scope.authcodediabled = false;

        $scope.backAction = backAction;
        $scope.resetAction = resetAction;
        $scope.getAuthcode = getAuthcode;

        var countDown = 120;
        var timer;


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
                myApp.alert('验证码发送失败，请重试');
            });
        }

        function resetAction() {

            if(!REGEX.PASSWORD.test($scope.password)) {
                myApp.alert('密码格式有误，必须为字母/数字或者特殊符号(-_@.$%#&*)，长度在8-20之间');
                return;
            }

            myApp.showIndicator();

            NetworkService.post('account/password/reset',{mobile:$scope.mobile,verificationCode:$scope.authcode,newPassword:$scope.password},function (res) {
                myApp.hideIndicator();
                myApp.alert('重置密码成功！', 'Air Community', function () {
                    mainView.router.back();
                });
            },function (err) {
                var errDesc = err.statusText;
                myApp.hideIndicator();
                myApp.alert('重置密码失败！' + errDesc, null);
            });

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