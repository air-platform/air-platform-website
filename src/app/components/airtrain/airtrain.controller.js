/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function() {
  'use strict';

  angular.module('airsc').controller('trainController', trainController);

  /** @ngInject */
  function trainController($scope, constdata, $timeout, NetworkService, UrlService, URL) {


      var query = mainView.activePage.query;
      console.log(query);

      if (query.type === 'schoollist'){
          $timeout(function () {
            mainView.router.loadPage('app/components/airtrain/schoollist.html');
          },500);
      }


    $scope.telephone = 'tel:' + constdata.supportTelephone;

    $scope.imgSrc = [
      'assets/images/training/AirTrannning-banner.png'
    ];
    
    myApp.showIndicator();
    NetworkService.get(UrlService.getUrl(URL.HOTCOURSE), null, function(res) {
      $scope.hotCourse = res.data;
      myApp.hideIndicator();
    }, function(err) {
      myApp.hideIndicator();
    });
  }

})();
