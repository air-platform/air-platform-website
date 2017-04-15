(function () {
    'use strict';

    angular.module('airsc').controller('gusetInfoController', gusetInfoController);

    /** @ngInject */
    function gusetInfoController($scope, iotUtil, NetworkService, UrlService, URL) {
    	$scope.guestList = [{
    		userName: '李明',
    		card: '610111198104070029'
    	}, {
    		userName: '王雀斑',
    		card: '610111193010970034'
    	}]

    	NetworkService.get(UrlService.getUrl(URL.COURSE), null,function (response) {
    		console.log(response);
    	}, function() {

    	});
    }
})();
