(function() {
  'use strict';

  angular.module('airsc').controller('courseDetailController', courseDetailController);

  /** @ngInject */
  function courseDetailController($scope, CommentServer, $timeout, NetworkService, UrlService, URL) {
    var queryData = myApp.views[0].activePage.query;

    myApp.showIndicator();

    if (queryData.id) {
      NetworkService.get(UrlService.getUrl(URL.COURSE + '/' + queryData.id), null, function(res) {
        $scope.courseObj = res.data;
        myApp.hideIndicator();
        $scope.enterObj = angular.toJson({
          id: $scope.courseObj.id,
          airType: $scope.courseObj.airType
        });

          /** 获取评论 **/
          $scope.score = $scope.courseObj.score;
          $scope.productId = queryData.id;
          getLatestFirstComment();

      }, function(err) {
        myApp.hideIndicator();
      });
    }









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
