/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope, iotUtil, NetworkService) {
        $scope.imgSrc = [
            './../assets/images/banner0.jpg',
            './../assets/images/banner1.jpg',
            './../assets/images/banner0.jpg'
        ];

        $scope.news = [
            '#最美航线大PK#',
            '#【原创】请问徐闻zhih到海口的直升机多长时间一班#',
            '#【原创】飞机飞到哪里去啊#'
        ]

        NetworkService.get('account/auth', function(res) {
            console.log(res);
        }, function(err) {
            console.log(err);
        });
    }

})();