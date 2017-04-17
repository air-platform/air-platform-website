(function () {
    'use strict';

    angular.module('airsc').controller('courseDetailController', courseDetailController);

    /** @ngInject */
    function courseDetailController($scope,iotUtil) {
        $scope.courseList = [{
            id: '1001',
            imgSrc: './../../../assets/images/hotair.png',
            titleText: '直升机私照飞行员',
            school: '海南航空学校',
            deadline: '2017年4月30日',
            price: '36万元'
        }, {
            id: '1002',
            imgSrc: './../../../assets/images/hotair.png',
            titleText: '固定翼飞行员1期招募',
            school: '海南航空学校',
            deadline: '2017年10月25日',
            price: '88.6万元' 
        }, {
            id: '1003',
            imgSrc: './../../../assets/images/hotair.png',
            titleText: '固定翼单发商照(不含仪表)',
            school: '海南航空学校',
            deadline: '2017年10月25日',
            price: '120万元'
        }];

        var queryData = myApp.views[0].activePage.query;

        if(queryData.id) {
            $scope.courseList.forEach(function(item){
                if(item.id === queryData.id) {
                    $scope.courseObj = item;
                    return;
                }
            });
        }
    }

})();