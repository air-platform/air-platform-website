/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('profileController', profileController);

    /** @ngInject */
    function profileController($scope, iotUtil) {
    	$scope.gotoAddGuest = function () {
            mainView.router.loadPage('app/components/profile/add-guest.html');
        }
    }
})();
