(function () {
    'use strict';

    angular.module('airsc').controller('airtaxiSelectController', airtaxiSelectController);

    /** @ngInject */
    function airtaxiSelectController($scope, iotUtil) {
    	$scope.airSelectList = [{
            imgSrc: './../../../assets/images/hotair.png',
            titleText: '首都直升机B-7186',
            disc: '航班号B-7651',
            time: '40',
            price: '1000'
        }, {
            imgSrc: './../../../assets/images/hotair.png',
            titleText: '首都直升机E-135',
            disc: '送10分钟地面直升机静态摄影',
            time: '40',
            price: '2000' 
        }, {
        	imgSrc: './../../../assets/images/hotair.png',
            titleText: '固定翼单发商照(不含仪表)',
            disc: '与机长互动沟通调整飞行高度和路线',
            time: '40',
            price: '3000'
        }];
    	
    	
    	
    	$scope.gotoOrderAction = gotoOrderAction;
    	
    	function gotoOrderAction() {
            mainView.pageData = {
                'from': 'airtaxi'
            };
            mainView.router.loadPage('app/components/order/orderadd.html');
        }
    	
    }
})();
