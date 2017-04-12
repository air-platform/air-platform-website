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


        // 获取 f7 页面
        var page = myApp.views[0];
        var pageContainer = $$(page.container);

        $scope.cancelAction = function () {
            mainView.router.back();
        }

        $scope.signinAction = function () {
            myApp.showIndicator();

            var username = pageContainer.find('input[name="username"]').val();
            var password = pageContainer.find('input[name="password"]').val();

            NetworkService.post('account/auth',{principal:username,credential:password},function (res) {
                myApp.hideIndicator();
                myApp.alert('登录成功！', 'Air Community', function () {
                    mainView.router.back();
                });
                console.log(res);
            },function (err) {
                var errDesc = err.statusText;
                myApp.hideIndicator();
                myApp.alert('操作失败！' + errDesc, null);
            });

        }

    }

})();