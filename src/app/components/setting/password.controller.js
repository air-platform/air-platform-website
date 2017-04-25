/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('passwordController', passwordController);

    /** @ngInject */
    function passwordController($scope,NetworkService, $rootScope, iotUtil, i18n) {

        $scope.oldPassword = '';
        $scope.newPassword = '';
        $scope.confirmPassword = '';
        $scope.resetAction = resetAction;


        function resetAction() {

            if ($scope.confirmPassword !== $scope.newPassword){
                myApp.alert('新密码与旧密码不匹配');
                return;
            }


            myApp.showIndicator();

            var param = {oldPassword:$scope.oldPassword,newPassword:$scope.newPassword};

            NetworkService.post('account/password',param,function (res) {
                myApp.hideIndicator();
                myApp.alert('重置密码成功！', 'Air Community', function () {
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
