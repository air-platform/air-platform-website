/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderdetailController', orderdetailController);

    /** @ngInject */
    function orderdetailController($scope,OrderServer,$interval,iotUtil,constdata) {


        $scope.just4Show = true;
        $scope.agreement = false;
        $scope.orderInfo = {};
        $scope.passengers = [];

        // 从上个页面获取信息
        var pageData = mainView.pageData;
        var pageType = pageData.from;
        if (pageType && pageType === 'orderadd'){//从air transportation过来
            $scope.orderInfo = pageData.info;
            $scope.passengers = pageData.passengers;
            $scope.just4Show = false;
        }else if (pageType && pageType === 'orderdetail'){
            var data = pageData.data;
            getOrder(data.id);
        }


        $scope.confirmAction = confirmAction;


        function confirmAction() {
            if ($scope.just4Show){
                mainView.router.back();
            }else{
                OrderServer.submitOrder('',{},function (res) {
                    showAlert('提交定单成功',function () {
                        mainView.router.back({url:constdata.router.airtrans.home});
                    });
                },function (err) {
                    showErrorAlert(err);
                });
            }
        }


        function getOrder(orderId) {
            OrderServer.getOrder(orderId,function (res) {
                console.log(res.data);
                var data = res.data;

                var price = 0;
                if (data.type === 'ferryflight') {
                    price = data.ferryFlight.price;
                    if (data.chartered) {
                        price = data.ferryFlight.seatPrice * data.passengers;
                    }
                }


                $scope.orderInfo = {
                    orderNo: data.orderNo,
                    creationDate:data.creationDate,
                    flight: data.ferryFlight.name,
                    date: data.ferryFlight.date,
                    departure:data.ferryFlight.departure,
                    arrival:data.ferryFlight.arrival,
                    time:data.ferryFlight.time,//creationDate
                    capacity:data.ferryFlight.seats,
                    interval:data.ferryFlight.timeSlot,
                    price:price,
                    type:data.type
                };//ferryflight

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
