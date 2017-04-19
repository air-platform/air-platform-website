/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('settingController', settingController);

    /** @ngInject */
    function settingController($scope,CommentServer, $rootScope, iotUtil, i18n) {


        $scope.gotoDetail = gotoDetail;

        function gotoDetail() {
            mainView.router.loadPage('app/components/setting/password.html');
        }




        /** -评论- **/
        $scope.loading = false;
        $scope.comments = [];
        var CCPage = 1;
        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {
            if ($scope.loading)return;
            $scope.loading = true;
        });

        getLatestFirstComment();

        function getLatestFirstComment(productId) {
            CommentServer.getLatestComment(productId,function (res) {

            });
        }
        function getComments(productId,cp) {
            CommentServer.getComments(productId,cp,function (res) {
                var data = res.data.content;
                if (data && data.length > 0){
                    //delete first
                    data.pop();
                }
                $scope.comments.concat(data);
                $scope.loading = false;
            },function (err) {
                $scope.loading = false;
            });
        }

        /** -end- **/


    }

})();
