/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderdetailController', orderdetailController);

    /** @ngInject */
    function orderdetailController($scope,OrderServer,$interval,iotUtil,constdata) {
        var orderId = myApp.views[0].activePage.query.order;

        $scope.just4Show = true;
        $scope.agreement = false;
        $scope.orderInfo = {};
        $scope.passengers = [];

        getOrder(orderId);

        function getOrder(orderId) {
            OrderServer.getOrder(orderId,function (res) {
                console.log(res.data);
                var data = res.data;

                var price = data.chartered ? data.airTransport.aircraftItems[0].price : (data.airTransport.aircraftItems[0].seatPrice * data.passengers.length);


                $scope.orderInfo = {
                    orderNo: data.orderNo,
                    creationDate:data.creationDate,
                    flight: data.airTransport.aircraftItems[0].aircraft.name,
                    date: data.airTransport.date,
                    departure:data.airTransport.flightRoute.departure,
                    arrival:data.airTransport.flightRoute.arrival,
                    time:data.airTransport.timeEstimation,
                    capacity:data.airTransport.aircraftItems[0].aircraft.seats,
                    interval:data.timeSlot,
                    price:price,
                    seatPrice:data.airTransport.aircraftItems[0].seatPrice,
                    type:data.type
                };

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
