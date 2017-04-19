/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderListController', orderListController);

    /** @ngInject */
    function orderListController($scope,OrderServer,$interval,iotUtil) {


        $scope.items = [
            [{no:'订单编号: 993028364001',date:'订单时间: 2017-10-25',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:0}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017-10-25',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:1}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017-10-25',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:2}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017-10-25',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:3}]
        ];

        $scope.gotoOrderDetail = gotoOrderDetail;
        $scope.showSelectViewAction = showSelectViewAction;
        $scope.funAction = funAction;
        $scope.gotoCommentAction = gotoCommentAction;

        function funAction(index,tabIndex) {
            
        }
        function gotoCommentAction() {
            mainView.router.loadPage('app/components/comment/comment.html');
        }
        function gotoOrderDetail(itemIndex,index) {
            mainView.router.loadPage('app/components/order/orderdetail.html');
        }
        function cancelOrderAction() {
            OrderServer.cancelOrder('',function (res) {
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

        function getDatas() {
            OrderServer.getOrders(0,1,function (res) {
                var data = res.data;
                console.log(data.content);

            },function (err) {
                myApp.hideIndicator();
                showErrorAlert(err);
            });
        }
        getDatas();



    }

})();
