/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderdetailController', orderdetailController);

    /** @ngInject */
    function orderdetailController($scope,OrderServer,$interval,constdata) {
        var query = myApp.views[0].activePage.query;
        var orderId = query.order;

        $scope.just4Show = true;
        $scope.agreement = false;
        $scope.orderInfo = {};
        $scope.passengers = [];
        $scope.istour = false;


        $scope.telephone = 'tel:' + constdata.supportTelephone;


        getOrder(orderId);

        function getOrder(orderId) {
            OrderServer.getOrder(orderId,function (res) {
                var data = res.data;

                console.log(data);
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
                        type:data.type,
                        icon:data.aircraftItem.aircraft.vendor.avatar
                    };

                    $scope.passengers = data.passengers;

                }else if (data.type === 'airtaxi'){
                    $scope.istour = false;
                    var price = data.chartered ? data.airTaxi.aircraftItems[0].price : (data.airTaxi.aircraftItems[0].seatPrice * data.passengers.length);
                    $scope.orderInfo = {
                        orderNo: data.orderNo,
                        creationDate:data.creationDate,
                        flight: data.aircraftItem.aircraft.name,
                        date: data.date,
                        departure:data.airTaxi.departure,
                        arrival:data.airTaxi.arrival,
                        time:data.airTaxi.duration + '分钟',
                        capacity:data.aircraftItem.aircraft.seats,
                        interval:data.timeSlot,
                        price:price,
                        seatPrice:data.aircraftItem.aircraft.seatPrice,
                        type:data.type,
                        icon:data.aircraftItem.aircraft.vendor.avatar
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
                        time:data.airTransport.timeEstimation + '分钟',
                        capacity:data.airTransport.aircraftItems[0].aircraft.seats,
                        interval:data.timeSlot,
                        price:price,
                        seatPrice:data.airTransport.aircraftItems[0].seatPrice,
                        type:data.type,
                        icon:data.airTransport.vendor.avatar
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
