(function() {
  'use strict';

  angular.module('airsc').controller('gusetInfoController', gusetInfoController);

  /** @ngInject */
  function gusetInfoController($scope, iotUtil, NetworkService, UrlService, URL) {
    $scope.noGuest = true;
    myApp.showIndicator();
    NetworkService.get(UrlService.getUrl(URL.USERPASSENGERS), null, function(res) {
      $scope.guestList = res.data;
      if ($scope.guestList.length == 0) {
        $scope.noGuest = false;
      } else {
        $scope.noGuest = true;
      }
      myApp.hideIndicator();
    }, function(err) {
      myApp.hideIndicator();
    });

    $scope.delGuest = function(guest) {
      myApp.confirm('你确定要删除旅客' + guest.name + '吗？', '删除旅客', function() {
        NetworkService.delete(UrlService.getUrl(URL.USERPASSENGERS), guest.id, function(res) {
          myApp.alert('删除成功', null);
          mainView.router.back();
        }, function(err) {
          myApp.alert('删除失败，' + err.statusText, null);
        });
      });
    }
  }
})();
