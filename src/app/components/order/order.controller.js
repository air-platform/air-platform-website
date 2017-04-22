/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderListController', orderListController);

    /** @ngInject */
    function orderListController($scope,OrderServer,NotificationService,$timeout,constdata) {

        var loadings = [false,false,false,false];
        var loadingPages = [1,1,1,1];
        var tabIndexNow = 0;
        $scope.loading = false;
        $scope.items = [[],[],[],[]];

        $scope.tabChanged = tabChanged;
        $scope.funAction = funAction;
        $scope.gotoOrderDetail = gotoOrderDetail;
        $scope.deleteOrderAction = deleteOrderAction;

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
            }else if (item.status === 'paid'){

            }else if (item.status === 'finished' && !item.commented){
                gotoCommentAction(item.id,item);
            }
        }

        function gotoCommentAction(orderId,item) {
            mainView.router.loadPage(constdata.router.comment.add + '?orderId=' + orderId + '&date=' + item.creationDate + '&title=' + item.showTitle + '&subtitle=' + item.showSubtitle + '&price=' + item.price + '&orderNo=' + item.orderNo);
        }
        function gotoOrderDetail(index,tabIndex) {

            var item = $scope.items[tabIndex][index];

            var type = item.type;
            if (type === 'ferryflight') {
                mainView.router.loadPage(constdata.router.order.detail.ferryflight + '?order=' + item.id);
            }else if (type === 'fleet') {
                mainView.router.loadPage(constdata.router.order.detail.fleet + '?order=' + item.id);
            }else if (type === 'jetcard') {
                mainView.router.loadPage(constdata.router.order.detail.jetcard + '?order=' + item.id);
            }else if (type === 'course'){
                mainView.router.loadPage(constdata.router.order.detail.course + '?order=' + item.id);
            }else {
                mainView.router.loadPage(constdata.router.order.detail.transportation + '?order=' + item.id);
            }

        }
        function cancelOrderAction(orderId,index,tabIndex) {
            myApp.confirm('订单取消后无法恢复', '确定取消订单吗',
                function () {
                    OrderServer.cancelOrder(orderId,function (res) {
                        //TODO:更新其它里面的对应订单
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
        function deleteOrderAction(index,tabIndex) {
            var item = $scope.items[tabIndex][index];
            OrderServer.deleteOrder(item.id,function (res) {
                //TODO:删除其它tab1,tab2，tab3里面的对应订单
                myApp.alert('删除成功',function () {
                    $scope.items[tabIndex].splice(index,1);
                    $scope.$apply();
                });
            });
            // myApp.confirm('确定删除订单吗',
            //     function () {
            //
            //     }
            // );
        }
        function updateStatus(orderId,status) {
            $scope.items.forEach(function (orders,tabIndex) {
                orders.forEach(function (order,index) {
                    if (order.id === orderId){
                        if (order.id === orderId){
                            $scope.items[tabIndex][index].status = status;
                        }
                    }
                });
            });
        }
        function deleteOrderWithId(orderId) {

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
                    d.showTitle = d.flightLegs[0].departure + ' → ' + d.flightLegs[0].arrival;
                    d.showSubtitle = d.fleetCandidates[0].fleet.name;
                    d.price = d.fleetCandidates[0].fleet.price;
                }else if (type === 'jetcard') {
                    d.showTitle = d.jetCard.name + ' ' + d.jetCard.summary;
                    d.showSubtitle = d.jetCard.description;
                    d.price = d.jetCard.price;
                }else if (type === 'course'){
                    d.showTitle = d.course.name;
                    d.showSubtitle = d.course.location;
                    d.price = d.course.price;
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
            $timeout(function () {
                $scope.loading = loadings[tabIndexNow];
            },500);
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
