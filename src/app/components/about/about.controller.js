/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('aboutController', aboutController);

    /** @ngInject */
    function aboutController($scope,iotUtil) {
        /* jshint validthis: true */
        var vm = this;

        $scope.title = "Is in main.controller.js";

        $scope.about2 = 'aboutsss';

        console.log(iotUtil.uuid());
    }

})();