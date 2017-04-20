(function() {
  'use strict';

  angular.module('airsc').controller('addGuestController', addGuestController);

  /** @ngInject */
  function addGuestController($scope, iotUtil, i18n, NetworkService, UrlService, URL, NotificationService) {
    $scope.quest = {
      name: '',
      identity: '',
      mobile: '13012345678'
    };

    // $scope.addGuest = function() {
    //   $scope.questList.push({
    //     name: '',
    //     identity: ''
    //   });
    // };

    $$('.alert-check').on('click', function() {
      if ($scope.quest.name === '' || $scope.quest.identity === '') {
        NotificationService.alert.success(i18n.t('profile.check-input'), i18n.t('profile.addGuest'));
        return;
      }

      NetworkService.post(UrlService.getUrl(URL.USERPASSENGERS), $scope.quest, function(res) {
        NotificationService.alert.success(i18n.t('profile.addSucess'), i18n.t('profile.addGuest'));
        mainView.router.back();
      }, function(err) {
        NotificationService.alert.error(i18n.t('profile.addFailed') + i18n.t(err.statusText), i18n.t('profile.addGuest'));
      });
    });
  }
})();
