(function() {
  'use strict';

  angular.module('airsc').controller('modifyController', modifyController);

  /** @ngInject */
  function modifyController($scope, $rootScope, i18n, iotUtil, NetworkService, UrlService, URL) {
    var queryData = myApp.views[0].activePage.query;

    var infoObj = {
      nickName: i18n.t('profile.nickname'),
      realName: i18n.t('profile.username'),
      email: i18n.t('profile.email')
    };
    console.log(queryData);
    $.each(queryData, function(index, item) {
      $scope.headText = i18n.t('profile.modify') + infoObj[index];
      $scope.info = index;
      $('#modifyInfo').text($scope.headText);
    });

    $scope.saveBtn = function() {
      if ($rootScope.userInfo.email && $scope.info === 'email') {
        NetworkService.post(UrlService.getUrl(URL.USEREMAIL), {email: $rootScope.userInfo.email}, function(res) {
          myApp.alert('修改成功', $scope.headText);
          mainView.router.back();
        }, function(err) {
          myApp.alert('修改失败', $scope.headText);
          mainView.router.back();
        });
      } else if ($rootScope.userInfo[$scope.info] && $rootScope.userInfo[$scope.info] === $scope.info) {
        NetworkService.put(UrlService.getUrl(URL.PROFILE), $rootScope.userInfo, function(res) {
          myApp.alert('修改成功', $scope.headText);
          mainView.router.back();
        }, function(err) {
          myApp.alert('修改失败', $scope.headText);
          mainView.router.back();
        });
      } else {
        mainView.router.back();
      }
    }
  }
})();
