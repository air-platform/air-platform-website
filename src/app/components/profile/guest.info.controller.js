(function () {
    'use strict';

    angular.module('airsc').controller('gusetInfoController', gusetInfoController);

    /** @ngInject */
    function gusetInfoController($scope, iotUtil, NetworkService, UrlService, URL) {

    	NetworkService.get(UrlService.getUrl(URL.USERPASSENGERS), null, function(res) {
            $scope.guestList = res.data;
            if($scope.guestList.length == 0) {
                $scope.noGuest = false;
            } else {
                $scope.noGuest = true;
            }
    	}, function(err) {

    	});
    }
})();
