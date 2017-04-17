/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderaddController', orderaddController);

    /** @ngInject */
    function orderaddController($scope,NetworkService,$interval,iotUtil) {


        $scope.newPerson = {name:'',id:'',phone:''};

        $scope.addNewPersonAction = addNewPersonAction;
        $scope.closeModalAction = closeModalAction;

        function addNewPersonAction() {
            myApp.popup('.popup-about');
        }
        function closeModalAction() {
            myApp.closeModal('.popup-about');
        }

    }

})();
