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
    function resetController($scope,NetworkService,iotUtil) {

        $scope.mobile = '';
        $scope.password = '';
        $scope.authcode = '';

        $scope.backAction = backAction;
        $scope.resetAction = resetAction;

        function resetAction() {
            myApp.showIndicator();

            NetworkService.post('account',{mobile:$scope.mobile,verificationCode:$scope.authcode,password:$scope.password},function (res) {
                myApp.hideIndicator();
                myApp.alert('修改成功！', 'Air Community', function () {
                    mainView.router.back();
                });
            },function (err) {
                var errDesc = err.statusText;
                myApp.hideIndicator();
                myApp.alert('操作失败！' + errDesc, null);
            });
        }
        function backAction() {
            mainView.router.back();
        }

    }

})();