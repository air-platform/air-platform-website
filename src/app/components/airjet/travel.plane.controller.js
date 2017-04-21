/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelPlaneController', travelPlaneController);

    /** @ngInject */
    function travelPlaneController($scope, $timeout, NotificationService,CommentServer,StorageService, NetworkService, UrlService, URL) {
        var page = 1;
        var transferData = StorageService.get('plan');
        var queryData = myApp.views[0].activePage.query;
        $scope.jumpInfo = jumpInfo;
        angular.element('.pull-to-refresh-content').on('refresh', getPlaneList);

        if(queryData.type){
            angular.element('#plane-title').text(queryData.type);
            $timeout(function(){
                getPlaneList();
            },200);
        }
        if(queryData.id || queryData.flightno){
            $timeout(function(){
                getPlaneDetail();
            },200);
        }

        function getPlaneList() {
            var data = {
                page: page,
                pageSize: 10,
                type: queryData.type
            };
            NetworkService.get(UrlService.getUrl(URL.AIRJET_PLANE), data, function(response) {
                $scope.planeList = response.data.content;
                if(response.data.totalPages > page){
                    page ++;
                }
                myApp.pullToRefreshDone();
            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function getPlaneDetail() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_PLANE) + '/' + (queryData.id || ('query/flightno/' + queryData.flightno)), null, function(response) {
                $scope.planeDetail = response.data;
                angular.element('#plane-detail-title').text(response.data.name);
                if(response.data.appearances) {
                    $scope.appearances = response.data.appearances.split(';');
                }

                // 获取评论
                $scope.score = $scope.planeDetail.score;
                getLatestFirstComment($scope.planeDetail.id);

            }, function(){
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function jumpInfo(data) {
            $scope.planeArr = [];
            if(data.every(function(item){
                return item.selected === false;
            })){
                NotificationService.alert.success('请至少选择一架飞机', null);
                return;
            }
            data.forEach(function(item){
                if(item.selected) {
                    $scope.planeArr.push({ fleet: item.id });
                }
            });
            transferData.plane = $scope.planeArr;
            StorageService.put('plan', transferData);
            mainView.router.loadPage('app/components/airjet/travel-info.html');
        };






        /** -评论- **/
        $scope.loading = false;
        //$scope.score = 0;
        $scope.comments = [];
        var CCPage = 1;
        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {
            if ($scope.loading)return;
            $scope.loading = true;
            console.log('comment');
        });


        function getLatestFirstComment(productId) {
            CommentServer.getLatestComment(productId,function (res) {
                console.log(res.data.content);

                var cs = res.data.content;
                if (cs.length > 0){
                    $scope.comments = cs;
                }

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