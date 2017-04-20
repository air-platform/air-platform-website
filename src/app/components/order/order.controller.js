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
            mainView.router.loadPage('app/components/comment/comment.html');
        }
        function gotoOrderDetail(index,tabIndex) {
            mainView.router.loadPage('app/components/order/orderdetail.html');
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

                var tempData = $scope.items[tabIndex].concat(data);
                $scope.items[tabIndex] = tempData;

                loadingPages[tabIndex] = loadingPages[tabIndex] + 1;
                loadings[tabIndex] = false;
                updateDisplayLoadingStatus();

            },function (err) {
                console.log(err);

                loadings[tabIndex] = false;
                updateDisplayLoadingStatus();
            });
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
