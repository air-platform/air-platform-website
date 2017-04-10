/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('mainController', mainController);

    /** @ngInject */
    function mainController($translate,iotUtil) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = "Is in main.controller.js";

        vm.about = 'about';

        console.log(iotUtil.uuid());
    }

})();