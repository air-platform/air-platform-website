(function() {
  'use strict';

  angular.module('airsc').controller('courseDetailController', courseDetailController);

  /** @ngInject */
  function courseDetailController($scope, iotUtil, NetworkService, UrlService, URL) {
    var queryData = myApp.views[0].activePage.query;

    myApp.showIndicator();

    if (queryData.id) {
      NetworkService.get(UrlService.getUrl(URL.COURSE + '/' + queryData.id), null, function(res) {
        $scope.courseObj = res.data;
        myApp.hideIndicator();
      }, function(err) {
        myApp.hideIndicator();
      });
    }
  }

})();
