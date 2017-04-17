/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderaddController', orderaddController);

    /** @ngInject */
    function orderaddController($scope,NetworkService,$interval,iotUtil) {


        $scope.addNewPersonAction = addNewPersonAction;
        
        
        function addNewPersonAction() {
            console.log('add');
        }


    }

})();
