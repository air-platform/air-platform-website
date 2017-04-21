(function() {
  'use strict';

  angular.module('airsc').controller('courseController', courseController);

  /** @ngInject */
  function courseController($scope, iotUtil, i18n, NetworkService, UrlService, URL) {
    myApp.showIndicator();

    NetworkService.get(UrlService.getUrl(URL.COURSE + '?airType=直升机'), null, function(res) {
      $scope.courseCopterList = res.data.content;
      myApp.hideIndicator();
    }, function(err) {
      myApp.hideIndicator();
    });

    NetworkService.get(UrlService.getUrl(URL.COURSE + '?airType=固定翼'), null, function(res) {
      $scope.courseFixedList = res.data.content;
      myApp.hideIndicator();
    }, function(err) {
      myApp.hideIndicator();
    });
  }

})();
