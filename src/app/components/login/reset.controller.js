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
    function resetController($scope,iotUtil) {

        $scope.mobile = '';
        $scope.password = '';
        $scope.authcode = '';

        $scope.backAction = backAction;

        $scope.resetAction = resetAction;

        function resetAction() {

        }
        function backAction() {
            mainView.router.back();
        }

    }

})();