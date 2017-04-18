/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('passwordController', passwordController);

    /** @ngInject */
    function passwordController($scope, $rootScope, iotUtil, i18n) {

        $scope.oldPassword = '';
        $scope.newPassword = '';
        $scope.resetAction = resetAction;


        function resetAction() {
            myApp.showIndicator();

            NetworkService.post('account/password',{oldPassword:$scope.oldPassword,newPassword:$scope.newPassword},function (res) {
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
