/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('planesController', planesController);

    /** @ngInject */
    function planesController($scope, iotUtil, NetworkService) {
        var controller = this;
        controller.planes = [];
        controller.planeType = '';

        controller.planes = [
          {
            'name': '首航直升机B-7186',
            'imageUrl': 'assets/images/b-7186.png',
            'rentFee': 5000,
            'ticketFee': 1000,
            'delay': '15min',
            'seats': 5,
            'minPassengers': 3
          },
          {
            'name': '首航直升机B-7438',
            'imageUrl': 'assets/images/b-7438.png',
            'rentFee': 5000,
            'ticketFee': 1000,
            'delay': '15min',
            'seats': 5,
            'minPassengers': 3
          },
          {
            'name': '首航直升机B-7441',
            'imageUrl': 'assets/images/b-7441.png',
            'rentFee': 5000,
            'ticketFee': 1000,
            'delay': '15min',
            'seats': 5,
            'minPassengers': 3
          }
        ];
        $scope.$watch(
          function() {
            return controller.planeType;
          },
          function(oldValue, newValue) {
            if(newValue != oldValue) {
              // retrieve available planes according to type

            }
          }
        );
    }

})();
