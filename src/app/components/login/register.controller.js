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

        // 获取 f7 页面
        var page = myApp.views[0];
        var pageContainer = $$(page.container);

        $scope.backAction = function () {
            mainView.router.back();
        }
        
        $scope.registerAction = function () {
            myApp.showIndicator();

            var username = pageContainer.find('input[name="username"]').val();
            var authcode = pageContainer.find('input[name="auth"]').val();
            var password = pageContainer.find('input[name="password"]').val();

            NetworkService.post('account',{mobile:username,verificationCode:authcode,password:password},function (res) {
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