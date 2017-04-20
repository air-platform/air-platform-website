/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderListController', orderListController);

    /** @ngInject */
    function orderListController($scope,OrderServer,NotificationService) {

        $scope.items = [[],[],[],[]];

        $scope.tabChanged = tabChanged;
        $scope.gotoOrderDetail = gotoOrderDetail;
        $scope.showSelectViewAction = showSelectViewAction;
        $scope.funAction = funAction;
        $scope.gotoCommentAction = gotoCommentAction;

        function tabChanged(tabIndex) {
            var tempData = $scope.items[tabIndex];
            if (0 === tempData.length){
                getDatas(tabIndex,1);
            }
        }
        function funAction(index,tabIndex) {
            var item = $scope.items[tabIndex][index];
            if (item.status === 'pending'){//取消订单
                cancelOrderAction(item.id);
            }else if (item.status === 'paid'){//评价
                gotoCommentAction(item.id);
            }else if (item.status === 'cancelled'){//再次下单

            }
            //do nothing
        }
        function gotoCommentAction(orderId) {
            mainView.router.loadPage('app/components/comment/comment.html');
        }
        function gotoOrderDetail(index,tabIndex) {
            mainView.router.loadPage('app/components/order/orderdetail.html');
        }
        function cancelOrderAction(orderId) {
            OrderServer.cancelOrder(orderId,function (res) {
                var data = res.data;
                console.log(data.content);
            },function (err) {
                showErrorAlert(err);
            });
        }
        function showSelectViewAction() {
            console.log('---');
        }

        function showErrorAlert(err) {
            var errDesc = err.statusText;
            NotificationService.alert.error('操作失败！' + errDesc, null);
        }

        function getDatas(tabIndex,page) {
            OrderServer.getOrders(tabIndex,page,function (res) {
                var data = res.data.content;
                console.log(data);
                var tempData = $scope.items[tabIndex].concat(data);
                $scope.items[tabIndex] = tempData;

            },function (err) {
                myApp.hideIndicator();
                showErrorAlert(err);
            });
        }


        tabChanged(0);

    }

})();
