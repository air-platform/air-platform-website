/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('CommentController', CommentController);

    /** @ngInject */
    function CommentController($scope, CommentServer,$rootScope,constdata) {

        $scope.orderInfo = {};

        var query = mainView.activePage.query;
        var orderId = query.orderId;

        $scope.orderInfo.orderNo = query.orderNo;
        $scope.orderInfo.title = query.title;
        $scope.orderInfo.subtitle = query.subtitle;
        $scope.orderInfo.price = query.price;
        $scope.orderInfo.date = query.date;


        $scope.starNum = 0;
        $scope.content = '';
        $scope.markStarAction = markStarAction;
        $scope.submitComment = submitComment;

        function markStarAction(mark) {
            $scope.starNum = mark;
        }




        function submitComment() {

            myApp.showIndicator();
            var param = {rate:$scope.starNum,date:'2017-04-21',content:$scope.content};
            CommentServer.submitComment(orderId,param,function (res) {
                myApp.hideIndicator();

                $rootScope.$emit(constdata.notification_refresh_order_status,query);

                myApp.alert('评论成功',function () {
                    $rootScope.$emit(constdata.notification_refresh_order_status,{type:'comment',orderId:orderId});
                    mainView.router.back();
                });
            },function (err) {
                myApp.hideIndicator();
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