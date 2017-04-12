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
    function loginController($scope,NetworkService,iotUtil) {


        $scope.principal = '';
        $scope.credential = '';

        $scope.cancelAction = cancelAction;
        $scope.signinAction = signinAction;


        // 获取 f7 页面
        // var page = myApp.views[0];
        // var pageContainer = $$(page.container);
        // var username = pageContainer.find('input[name="username"]').val();
        // var password = pageContainer.find('input[name="password"]').val();



        function cancelAction() {
            mainView.router.back();
        }

        function signinAction() {
            myApp.showIndicator();
            NetworkService.post('account/auth',{principal:$scope.principal,credential:$scope.credential},function (res) {
                myApp.hideIndicator();
                myApp.alert('登录成功！', 'Air Community', function () {
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