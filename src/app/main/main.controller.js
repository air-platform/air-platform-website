/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('mainController', mainController);

    /** @ngInject */
    function mainController($scope, iotUtil,$translate, NetworkService) {

        $translate('air-community').then(function (headline) {
            $scope.title = headline;
        }, function (translationId) {
            $scope.title = translationId;
        });

        var page = myApp.views[0];
        var pageContainer = $$(page.container);
        var ul = pageContainer.find('.news-text');

        $scope.imgSrc = [
            './../assets/images/banner0.jpg',
            './../assets/images/banner1.jpg',
            './../assets/images/banner0.jpg'
        ];

        $scope.addLi = function(listNew) {
            var li = '<li><a href="#">';
            li += listNew;
            li += '</a></li>';
            ul.append(li);
        }

        $scope.listNews = [
            '#最美航线大PK#',
            '#【原创】请问徐闻zhih到海口的直升机多长时间一班#',
            '#【原创】飞机飞到哪里去啊#'
        ]

        for (var i = 0; i < $scope.listNews.length; i++) {
            $scope.addLi($scope.listNews[i]);
        }

        function test() {
            NetworkService.get('account/auth',null, function(res) {
                console.log(res);
            }, function(err) {
                console.log(err);
            });
        }

    }

})();