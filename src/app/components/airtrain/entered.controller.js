(function() {
  'use strict';

  angular.module('airsc').controller('enteredController', enteredController);

  /** @ngInject */
  function enteredController($scope, iotUtil, i18n, NetworkService, UrlService, URL) {
    var queryData = myApp.views[0].activePage.query;
    $scope.enterObj = angular.fromJson(queryData.param);
    $scope.enterObj.license = '私照';

    $scope.enterBtn = function() {
      console.log($scope.enterObj.license);
    }
  }
})();
