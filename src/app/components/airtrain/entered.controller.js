(function() {
  'use strict';

  angular.module('airsc').controller('enteredController', enteredController);

  /** @ngInject */
  function enteredController($scope, iotUtil, i18n, NetworkService, UrlService, URL) {
    var queryData = myApp.views[0].activePage.query;
    $scope.enterObj = angular.fromJson(queryData.param);
    $scope.enterObj.license = '私照';
    $scope.enterObj.location = '北京';
    $scope.enterObj.course = $scope.enterObj.id;

    delete $scope.enterObj.id;

    $scope.enterBtn = function() {
      if(!$scope.enterObj.person && !$scope.enterObj.identity) {
        myApp.alert(i18n.t('profile.check-input'), null)
        return;
      }
      console.log($scope.enterObj);
      NetworkService.post(UrlService.getUrl(URL.COURSEENTER), $scope.enterObj, function(res) {
        myApp.alert('报名成功！', null)
        mainView.router.back();
      }, function(err) {
        myApp.alert('报名失败，' + err.statusText, null);
        mainView.router.back();
      });
    }
  }
})();
