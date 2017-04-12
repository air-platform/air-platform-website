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
    function registerController($scope,NetworkService,iotUtil) {

        $scope.mobile = '';
        $scope.password = '';
        $scope.authcode = '';
        $scope.confirm_password = '';

        $scope.backAction = backAction;
        $scope.registerAction = registerAction;

        // 获取 f7 页面
        // var page = myApp.views[0];
        // var pageContainer = $$(page.container);
        // var username = pageContainer.find('input[name="username"]').val();
        // var authcode = pageContainer.find('input[name="auth"]').val();
        // var password = pageContainer.find('input[name="password"]').val();


        function backAction() {
            mainView.router.back();
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


    }

})();