/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('mainController', mainController);

    /** @ngInject */
    function mainController() {
        /* jshint validthis: true */
        var vm = this;

        vm.title = "Is in main.controller.js";

    }

})();