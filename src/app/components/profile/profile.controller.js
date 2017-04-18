/**
 * Created by Otherplayer on 16/7/21.
 */
(function() {
  'use strict';

  angular.module('airsc').controller('profileController', profileController);

  /** @ngInject */
  function profileController($scope, $rootScope, iotUtil, i18n, NetworkService, UrlService, URL) {
    $scope.notSet = i18n.t('profile.not-set');
    $scope.gender = {
      male: '男',
      female: '女'
    }

    NetworkService.get(UrlService.getUrl(URL.PROFILE), null, function(res) {
      $rootScope.userInfo = res.data;

      $scope.watch = $rootScope.$watch('userInfo.gender', function(newValue, oldValue) {
        if (newValue != oldValue) {
          NetworkService.put(UrlService.getUrl(URL.PROFILE), $rootScope.userInfo, function(res) {
            if (res.status === 200) {
              myApp.alert('修改成功', $scope.headText);
            }
          }, function(err) {
            myApp.alert(err.statusText, $scope.headText);
          });
        }
      });
    }, function(err) {
      console.log(err);
    });

    $$('.link.close-picker').on('click', function() {
      console.log('点了');
    });

    $scope.gotoAddGuest = function() {
      mainView.router.loadPage('app/components/profile/add-guest.html');
    }
  }
})();
