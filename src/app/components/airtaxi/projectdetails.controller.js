/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('airtaxiDetailsController', airtaxiDetailsController);

    /** @ngInject */
    function airtaxiDetailsController($scope,CommentServer,$timeout,transUtilsService,NetworkService) {
        /* jshint validthis: true */
        var vm = this;

        var drawMap = function(target, points) {
            var map = new BMap.Map(target);
            map.disableDragging();
            map.disableScrollWheelZoom();
            map.disableDoubleClickZoom();
            map.disablePinchToZoom();
            _.each(points, function(pt) {
              var marker = new BMap.Marker(new BMap.Point(pt[1], pt[2]));
              var label = new BMap.Label(pt[0]);
              label.setOffset(new BMap.Size(15, -15));
              marker.setLabel(label);
              marker.disableDragging();
              map.addOverlay(marker);
            });
            var markers = _.map(points, function(pt){
              return new BMap.Point(pt[1], pt[2]);
            });
            map.setViewport(markers);
            //创建弧线对象
            var curve = new BMapLib.CurveLine(markers, {
                strokeColor: "red",
                strokeWeight: 3,
                strokeOpacity: 0.5
            });
            map.addOverlay(curve);
        }
        var init = function() {
          mainView.pageData = mainView.pageData || {};
          vm.site = mainView.pageData.site;
          vm.mapPoints = transUtilsService.extractPoints(vm.site.tourPoint);
          vm.city = mainView.pageData.city;
          angular.element(".navbar-inner .topbar-with-icon").text(vm.city);
          drawMap("airtaxi-details-map-view", vm.mapPoints);

            /** 获取评论 **/
            $scope.score = vm.site.score;
            $scope.productId = vm.site.id;
            getLatestFirstComment();


        }
        init();





        /** -评论- **/
        $scope.loading = false;
        $scope.score = 0;
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
