/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderController', orderController);

    /** @ngInject */
    function orderController($scope,NetworkService,$interval,iotUtil) {


        $scope.items = [
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:0}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:1}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:2}],
            [{no:'订单编号: 993028364001',date:'订单时间: 2017年10月25日',url:'http://p2.ifengimg.com/a/2017_15/f5455f5a3ba44fc_size18_w490_h271.jpg',name:'固定翼私照',subname:'海南航空学校',price:'￥25万元',status:3}]
        ];



        $scope.showSelectViewAction = showSelectViewAction;


        
        
        function showSelectViewAction() {
            
        }

    }

})();