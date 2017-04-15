(function () {
    'use strict';

    angular.module('airsc').controller('addGuestController', addGuestController);

    /** @ngInject */
    function addGuestController($scope, iotUtil, i18n) {
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

    	$$('.alert-check').on('click', function() {
    		var questList = $scope.questList;
    		$.each($scope.questList, function(index, quest) {
    			if(quest.userName == '' || quest.card == '') {
    				myApp.alert(i18n.t('profile.check-input'), '添加旅客');
    			} else {
    				console.log($scope.questList);
    			}
    		});
    	});
    }
})();
 