/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderdetailController', orderdetailController);

    /** @ngInject */
    function orderdetailController($scope,NetworkService,$interval,iotUtil,constdata) {


        $scope.gotoAnnounceAction = gotoAnnounceAction;

        function gotoAnnounceAction() {
            mainView.router.loadPage(constdata.router.protocal.announce);
        }

    }

})();
