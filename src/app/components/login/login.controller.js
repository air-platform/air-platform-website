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
    function loginController($scope,iotUtil) {

        $scope.signinAction = function () {
            console.log('Sign in');
        }
        $scope.gotoRigister = function () {
            console.log('Go to register');
        }
        $scope.forgotPassword = function () {
            console.log('forgot password');
        }

        console.log('----');
    }

})();