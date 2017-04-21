/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderListController', orderListController);

    /** @ngInject */
    function orderListController($scope,OrderServer,NotificationService) {

        var loadings = [false,false,false,false];
        var loadingPages = [1,1,1,1];
        var tabIndexNow = 0;
        $scope.loading = false;
        $scope.items = [[],[],[],[]];

        $scope.tabChanged = tabChanged;
        $scope.funAction = funAction;
        $scope.gotoOrderDetail = gotoOrderDetail;

        function tabChanged(tabIndex) {
            var tempData = $scope.items[tabIndex];
            tabIndexNow = tabIndex;

            if (0 === tempData.length){
                getDatas(tabIndex,1);
            }

            updateDisplayLoadingStatus();
        }
        function funAction(index,tabIndex) {
            var item = $scope.items[tabIndex][index];

            if (item.status === 'pending'){//取消订单
                cancelOrderAction(item.id,index,tabIndex);
            }else if (item.status === 'paid'){//评价
                gotoCommentAction(item.id);
            }else if (item.status === 'cancelled'){//再次下单

            }
        }


        function gotoCommentAction(orderId) {
            mainView.router.loadPage('app/components/comment/comment.html?orderId=' + orderId);
        }
        function gotoOrderDetail(index,tabIndex) {

            var item = $scope.items[tabIndex][index];

            // app/components/airjet/tour-order.html?order=7f000101-5b8e-1f7b-815b-8ec507050011

            // var type = d.type;
            // if (type === 'ferryflight') {
            //     d.showTitle = d.ferryFlight.departure + ' → ' + d.ferryFlight.arrival;
            //     d.showSubtitle = '';
            //     d.price = d.chartered ? d.ferryFlight.price : d.ferryFlight.seatPrice * d.passengers;
            // }else if (type === 'fleet') {
            //     d.showTitle = 'fleet';
            //     d.showSubtitle = 'fleet';
            //     console.log(d);
            // }else if (type === 'jetcard') {
            //     d.showTitle = d.jetCard.name + ' ' + d.jetCard.summary;
            //     d.showSubtitle = d.jetCard.description;
            //     d.price = d.jetCard.price;
            // }else {
            //     console.log('unknown');
            //     console.log(d);
            // }
            mainView.router.loadPage('app/components/order/orderdetail.html');
            mainView.pageData = {
                'from': 'orderdetail',
                'data': $scope.items[tabIndex][index]
            };



        }
        function cancelOrderAction(orderId,index,tabIndex) {
            myApp.confirm('订单取消后无法恢复', '确定取消订单吗',
                function () {
                    OrderServer.cancelOrder(orderId,function (res) {
                        myApp.alert('取消成功',function () {
                            $scope.items[tabIndex][index].status = 'cancelled';
                            $scope.$apply();
                        });
                    },function (err) {
                        showErrorAlert(err);
                    });
                }
            );
        }



        function getDatas(tabIndex,page) {

            loadings[tabIndex] = true;
            updateDisplayLoadingStatus();

            OrderServer.getOrders(tabIndex,page,function (res) {
                var data = res.data.content;


                if (data.length > 0){
                    var result = dealOrderData(data);
                    var tempData = $scope.items[tabIndex].concat(result);
                    $scope.items[tabIndex] = tempData;
                }

                loadingPages[tabIndex] = loadingPages[tabIndex] + 1;
                loadings[tabIndex] = false;
                updateDisplayLoadingStatus();

            },function (err) {
                console.log(err);

                loadings[tabIndex] = false;
                updateDisplayLoadingStatus();
            });
        }
        function dealOrderData(data) {

            var result = [];
            data.forEach(function (d) {
                var type = d.type;
                if (type === 'ferryflight') {
                    d.showTitle = d.ferryFlight.departure + ' → ' + d.ferryFlight.arrival;
                    d.showSubtitle = '';
                    d.price = d.chartered ? d.ferryFlight.price : d.ferryFlight.seatPrice * d.passengers;
                }else if (type === 'fleet') {
                    d.showTitle = 'fleet';
                    d.showSubtitle = 'fleet';
                    console.log(d);
                }else if (type === 'jetcard') {
                    d.showTitle = d.jetCard.name + ' ' + d.jetCard.summary;
                    d.showSubtitle = d.jetCard.description;
                    d.price = d.jetCard.price;
                }else {
                    console.log('unknown');
                    console.log(d);
                }
                result.push(d);
            });

            return result;
        }

        function showErrorAlert(err) {
            var errDesc = err.statusText;
            NotificationService.alert.error('操作失败！' + errDesc, null);
        }
        function updateDisplayLoadingStatus() {
            $scope.loading = loadings[tabIndexNow];
        }



        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {
            if ($scope.loading){
                return;
            }
            getDatas(tabIndexNow,loadingPages[tabIndexNow]);
        });

        tabChanged(0);


    }

})();
