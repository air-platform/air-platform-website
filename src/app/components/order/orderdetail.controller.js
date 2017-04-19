/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderdetailController', orderdetailController);

    /** @ngInject */
    function orderdetailController($scope,NetworkService,$interval,iotUtil,constdata) {


        $scope.orderInfo = {};
        $scope.passengers = [];

        // 从上个页面获取信息
        var pageData = mainView.pageData;
        var pageType = pageData.from;
        if (pageType && pageType === 'orderadd'){//从air transportation过来
            $scope.orderInfo = pageData.orderInfo;
            $scope.passengers = pageData.passengers;
        }else{
            pageData = {};
        }


        $scope.gotoAnnounceAction = gotoAnnounceAction;

        function gotoAnnounceAction() {
            mainView.router.loadPage(constdata.router.protocal.announce);
        }

    }

})();
