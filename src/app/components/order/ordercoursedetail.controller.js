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


        function getOrder(orderId) {
            OrderServer.getOrder(orderId,function (res) {
                // console.log(res.data.course);
                $scope.order = res.data;
                // console.log($scope.order);

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