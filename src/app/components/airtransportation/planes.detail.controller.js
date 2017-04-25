(function() {
  'use strict';

  angular.module('airsc').controller('planesDetailController', planesDetailController);

  /** @ngInject */
  function planesDetailController($scope, $rootScope, i18n, StorageService,constdata, NetworkService, UrlService, URL) {
      

      /** -评论- **/
        $scope.loading = false;
        $scope.comments = [];
        $scope.showMore = false;
        $scope.showMoreCommentAction = showMoreCommentAction;
        var CCPage = 1;
        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {
            if ($scope.loading)return;
            $scope.loading = true;
            getComments(CCPage);
        });

        function showMoreCommentAction() {
            $scope.showMore = !$scope.showMore;
            getComments(1);
        }

        function getLatestFirstComment() {
            CommentServer.getLatestComment($scope.productId,function (res) {

                var cs = res.data.content;
                if (cs.length > 0){
                    $scope.comments = cs;
                }

            });
        }
        function getComments(page) {
            CommentServer.getComments($scope.productId,page,function (res) {
                var data = res.data.content;
                if (data && data.length > 0){
                    //delete first
                    CCPage = CCPage + 1;
                    var result = data;
                    if (result.length > 0){
                        if (1 === page){
                            $scope.comments.shift();
                        }
                        $scope.comments = $scope.comments.concat(result);
                    }
                }
                $timeout(function () {
                    $scope.loading = false;
                },500);
            },function (err) {
                $timeout(function () {
                    $scope.loading = false;
                },500);
            });
        }
        /** -end- **/
  }
})();
