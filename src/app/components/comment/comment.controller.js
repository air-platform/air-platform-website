/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('CommentController', CommentController);

    /** @ngInject */
    function CommentController($scope, CommentServer, iotUtil, i18n) {

        $scope.items = [
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:0}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:1}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:2}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:3}]
        ];


        var orderId = mainView.activePage.query.orderId;


        $scope.starNum = 0;
        $scope.markStarAction = markStarAction;
        $scope.submitComment = submitComment;

        function markStarAction(mark) {
            $scope.starNum = mark;
        }


        function submitComment() {
            var param = {rate:2,date:'2017-04-21',content:'lllllll'};
            CommentServer.submitComment(orderId,param,function (res) {
                console.log(res);
            },function (err) {
                console.log(err);
            });
        }

    }

})();