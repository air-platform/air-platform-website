/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('settingController', settingController);

    /** @ngInject */
    function settingController($scope,CommentServer, $rootScope, iotUtil, i18n) {


        $scope.gotoDetail = gotoDetail;

        function gotoDetail() {
            mainView.router.loadPage('app/components/setting/password.html');
        }


    }

})();
