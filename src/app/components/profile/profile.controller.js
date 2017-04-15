/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('profileController', profileController);

    /** @ngInject */
    function profileController($scope, $rootScope, iotUtil, i18n) {
    	$rootScope.userInfo = {
    		headerImg: './../../../assets/images/nav-icon.png',
    		nickname: '15202498406',
    		name: '',
    		sex: '',
    		tel: '15202498406',
    		email: ''
    	}

    	console.log($rootScope.userInfo);

    	$scope.notSet = i18n.t('profile.not-set');
    	$scope.gotoAddGuest = function () {
            mainView.router.loadPage('app/components/profile/add-guest.html');
        }
    }
})();
