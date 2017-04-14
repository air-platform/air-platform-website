(function () {
    'use strict';

    angular.module('airsc').controller('addGuestController', addGuestController);

    /** @ngInject */
    function addGuestController($scope, iotUtil) {
    	$scope.questList = [{
    		userName: '',
    		card: ''
    	}];

    	$scope.addGuest = function() {
    		$scope.questList.push({
    			userName: '',
    			card: ''
    		});
    	}

    	$scope.guestSubmit = function() {
    		console.log($scope.questList);
    	}
    }
})();
 