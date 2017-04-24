/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderdetailController', orderdetailController);

    /** @ngInject */
    function orderdetailController($scope,OrderServer,$interval,iotUtil,constdata) {
        var query = myApp.views[0].activePage.query;
        var orderId = query.order;
        $scope.type = query.type;

        $scope.just4Show = true;
        $scope.agreement = false;
        $scope.orderInfo = {};
        $scope.passengers = [];
        $scope.istour = false;

        getOrder(orderId);

        function getOrder(orderId) {
            OrderServer.getOrder(orderId,function (res) {
                console.log(res.data);
                var data = res.data;


                if (data.type === 'airtour'){
                    var tourPoints = data.airTour.tourPoint.split(';');
                    var price = data.chartered ? data.aircraftItem.price : (data.aircraftItem.seatPrice * data.passengers.length);
                    $scope.istour = true;
                    $scope.orderInfo = {
                        orderNo: data.orderNo,
                        creationDate:data.creationDate,
                        flight: data.aircraftItem.aircraft.name,
                        date: data.date,
                        departure:data.airTour.name,
                        // arrival:data.airTour.flightRoute.arrival,
                        time:data.airTour.tourDistance + '公里',
                        capacity:tourPoints.length + '景点',//tourPoint
                        interval:data.timeSlot,
                        price:price,
                        seatPrice:data.aircraftItem.seatPrice,
                        type:data.type
                    };

                    $scope.passengers = data.passengers;

                }else if (data.type === 'airtaxi'){
                    $scope.istour = false;
                    var price = data.chartered ? data.airTaxi.aircraftItems[0].price : (data.airTaxi.aircraftItems[0].seatPrice * data.passengers.length);
                    $scope.orderInfo = {
                        orderNo: data.orderNo,
                        creationDate:data.creationDate,
                        flight: data.airTaxi.aircraftItems[0].aircraft.name,
                        date: data.date,
                        departure:data.airTaxi.departure,
                        arrival:data.airTaxi.arrival,
                        time:data.airTaxi.timeEstimation,
                        capacity:data.airTaxi.aircraftItems[0].aircraft.seats,
                        interval:data.timeSlot,
                        price:price,
                        seatPrice:data.airTaxi.aircraftItems[0].seatPrice,
                        type:data.type
                    };

                    $scope.passengers = data.passengers;//passenger identity
                }else {
                    $scope.istour = false;
                    var price = data.chartered ? data.airTransport.aircraftItems[0].price : (data.airTransport.aircraftItems[0].seatPrice * data.passengers.length);
                    $scope.orderInfo = {
                        orderNo: data.orderNo,
                        creationDate:data.creationDate,
                        flight: data.airTransport.aircraftItems[0].aircraft.name,
                        date: data.date,
                        departure:data.airTransport.flightRoute.departure,
                        arrival:data.airTransport.flightRoute.arrival,
                        time:data.airTransport.timeEstimation,
                        capacity:data.airTransport.aircraftItems[0].aircraft.seats,
                        interval:data.timeSlot,
                        price:price,
                        seatPrice:data.airTransport.aircraftItems[0].seatPrice,
                        type:data.type
                    };

                    $scope.passengers = data.passengers;//passenger identity
                }



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
