/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelModelController', travelModelController);

    /** @ngInject */
    function travelModelController($scope, StorageService) {
        $scope.modelData = {};
        $scope.radioCheck = radioCheck;
        $scope.jumpPlane = jumpPlane;
        $scope.modelList = [{
            id: '1',
            name: 'BBJ',
            pic: 'assets/images/travel/BBJ.png',
            people: '16',
            luggage: '6.4m³',
            speed: '11687km'
        },{
            id: '2',
            name: '湾流G450',
            pic: 'assets/images/travel/湾流G450.png',
            people: '16',
            luggage: '6.4m³',
            speed: '11687km'
        },{
            id: '3',
            name: '湾流G550',
            pic: 'assets/images/travel/湾流G550.png',
            people: '16',
            luggage: '6.4m³',
            speed: '11687km'
        }];
        $scope.checkModel = $scope.modelList[0].name;

        function radioCheck(model) {
            $scope.checkModel = model.name;
        };

        function jumpPlane() {
            if($scope.checkModel){
                var transferData = StorageService.get('plan');
                transferData.type = $scope.checkModel;
                StorageService.put('plan', transferData);
                mainView.router.loadPage('app/components/airjet/travel-plane.html');
            }
        };

    }
})();