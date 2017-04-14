/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('flightsController', flightsController);

    /** @ngInject */
    function flightsController($scope, iotUtil, NetworkService) {
        var controller = this;
        controller.flights = {}
    }

})();
