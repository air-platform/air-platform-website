(function() {
  'use strict';

  angular.module('airsc').controller('enteredController', enteredController);

  /** @ngInject */
  function enteredController($scope, iotUtil, i18n, NetworkService, UrlService, URL, REGEX) {
    var queryData = myApp.views[0].activePage.query;

    $scope.enterObj = angular.fromJson(queryData.param);
    $scope.enterObj.license = '私照';
    $scope.enterObj.location = '北京';
    $scope.enterObj.course = $scope.enterObj.id;

    delete $scope.enterObj.id;

    $scope.licenses = ['私照', '商照'];
    $scope.place = ['北京', '宜昌', '安阳'];

    $scope.licenseClick = function(index) {
        $scope.enterObj.license = $scope.licenses[index];
    }

    $scope.locationClick = function(index) {
      $scope.enterObj.location = $scope.place[index];
    }

    $scope.enterBtn = function() {
      if(!$scope.enterObj.person && !$scope.enterObj.identity) {
        myApp.alert(i18n.t('profile.check-input'), null);
        return;
      }

      if(!REGEX.IDCARD.test($scope.enterObj.identity)) {
        myApp.alert('身份证格式不正确！', null);
        return;
      }

      NetworkService.post(UrlService.getUrl(URL.COURSEENTER), $scope.enterObj, function(res) {
        myApp.alert('报名成功！', null);
        mainView.router.back();
      }, function(err) {
        myApp.alert('报名失败，' + err.statusText, null);
        mainView.router.back();
      });
    }
  }
})();
