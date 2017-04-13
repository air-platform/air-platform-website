/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('trainController', trainController);

    /** @ngInject */
    function trainController($scope,iotUtil) {
    	$scope.imgSrc = [
            './../assets/images/banner0.jpg',
            './../assets/images/banner1.jpg',
            './../assets/images/banner0.jpg'
        ];

        $scope.hotCourse = [{
            imgSrc: './../../../assets/images/hotair.png',
            titleText: '直升机私照飞行员',
            school: '海南航空学校',
            deadline: '2017年4月30日',
            price: '36万元'
        }, {
            imgSrc: './../../../assets/images/hotair.png',
            titleText: '固定翼飞行员1期招募',
            school: '海南航空学校',
            deadline: '2017年10月25日',
            price: '88.6万元' 
        }];
    }

})();