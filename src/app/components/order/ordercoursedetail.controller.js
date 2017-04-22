/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('OrderCourseDetailController', OrderCourseDetailController);

    /** @ngInject */
    function OrderCourseDetailController($scope, OrderServer) {
        var queryData = myApp.views[0].activePage.query;

        $scope.order = {};

        getOrder(queryData.order);


        // course
        // license
        //     :
        //     "固定翼单发商照（不含仪表）"
        // location
        //     :
        //     "三峡机场"
        // name
        //     :
        //     "固定翼单发商照（不含仪表）"

        function getOrder(orderId) {
            OrderServer.getOrder(orderId,function (res) {
                console.log(res.data);
                $scope.order = res.data;

            },function (err) {
                showErrorAlert(err);
            });
        }
        function showErrorAlert(err) {
            var errDesc = err.statusText;
            showAlert(errDesc);
        }
        function showAlert(msg) {
            myApp.alert(msg);
        }

    }
})();