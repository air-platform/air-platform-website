/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('courseController', courseController);

    /** @ngInject */
    function courseController($scope,iotUtil) {

    	$scope.courseList = [{
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
        }, {
        	imgSrc: './../../../assets/images/hotair.png',
            titleText: '固定翼单发商照(不含仪表)',
            school: '海南航空学校',
            deadline: '2017年10月25日',
            price: '120万元'
        }];
    }

})();