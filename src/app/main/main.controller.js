/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope,iotUtil) {
        /* jshint validthis: true */
        var vm = this;

        $scope.title = "Is in main.controller.js";

        $scope.about = 'about';

        console.log(iotUtil.uuid());
    }

})();