(function () {
    'use strict';

    angular.module('airsc').controller('modifyController', modifyController);

    /** @ngInject */
    function modifyController($scope, $rootScope, iotUtil, NetworkService, UrlService, URL) {
    	var queryData = myApp.views[0].activePage.query;

    	if(queryData.param) {
    		$scope.info = queryData.param;
    		console.log($scope.info);
    	}
        $scope.saveBtn = function(info) {
            alert(info);
            mainView.router.back();
        }
    }
})();
