/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('airtaxiDetailsController', airtaxiDetailsController);

    /** @ngInject */
    function airtaxiDetailsController($scope,CommentServer,$timeout,mapUtilsService,NetworkService,NotificationService, MapService) {
        /* jshint validthis: true */
        var vm = this;
        var queryData = myApp.views[0].activePage.query;

        var drawMap = function(target, points) {
            // MapService.mapPromise().then(function () {
                var map = new BMap.Map(target);
                // map.disableDragging();
                // map.disableScrollWheelZoom();
                // map.disableDoubleClickZoom();
                // map.disablePinchToZoom();
                _.each(points, function (pt) {
                    var marker = new BMap.Marker(new BMap.Point(pt[1], pt[2]));
                    var label = new BMap.Label(pt[0]);
                    label.setOffset(new BMap.Size(15, -15));
                    marker.setLabel(label);
                    marker.disableDragging();
                    map.addOverlay(marker);
                });
                var markers = _.map(points, function (pt) {
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
            // })
        }

        var loadTourData = function(id) {
            NetworkService.get("tours/" + id,null, function(res) {
                console.log(res);
                vm.site = res.data;
                vm.city = res.data.city;
                vm.mapPoints = mapUtilsService.extractPoints(vm.site.tourPoint);
                angular.element(".navbar-inner .topbar-with-icon").text(vm.city);
                drawMap("airtaxi-details-map-view", vm.mapPoints);
                /** 获取评论 **/
                $scope.score = vm.site.score;
                $scope.productId = vm.site.id;
                getLatestFirstComment();
            }, function(res) {
                NotificationService.alert.error(res.statusText, null);
            });
        }



        var init = function() {
          mainView.pageData = mainView.pageData || {};
          if (queryData.tourId != null){
              loadTourData(queryData.tourId);
          }else{
              vm.site = mainView.pageData.site;
              vm.city = mainView.pageData.city;
              vm.mapPoints = mapUtilsService.extractPoints(vm.site.tourPoint);
              angular.element(".navbar-inner .topbar-with-icon").text(vm.city);
              drawMap("airtaxi-details-map-view", vm.mapPoints);

              console.log(vm.site);
              /** 获取评论 **/
              $scope.score = vm.site.score;
              $scope.productId = vm.site.id;
              getLatestFirstComment();
          }


        }
        init();





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
        function renderFooter() {
            var footerBtn = document.createElement('div');
            footerBtn.classList.add('footer-button');
            footerBtn.innerHTML = '<a class="next-button" href="app/components/airtaxi/airtaxi-select.html"">下一步</a>';
            return footerBtn;
        }


        $('.projectDetails').parent().append(renderFooter());

    }

})();
