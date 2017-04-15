/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelPlaneController', travelPlaneController);

    /** @ngInject */
    function travelPlaneController($scope,iotUtil) {
        $scope.imgSrc = [
            'assets/images/travel/timg.jpeg',
            'assets/images/travel/timg.jpeg',
            'assets/images/travel/timg.jpeg'
        ];

    }

})();