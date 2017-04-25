/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('travelPlaneController', travelPlaneController);

    /** @ngInject */
    function travelPlaneController($scope, $timeout, NotificationService, CommentServer, StorageService, NetworkService, UrlService, URL) {
        var page = 1;
        var transferData = StorageService.get('plan');
        var queryData = myApp.views[0].activePage.query;
        $scope.jumpInfo = jumpInfo;
        $scope.jumpPlaneDetail = jumpPlaneDetail;
        angular.element('.pull-to-refresh-content').on('refresh', getPlaneList);

        if (queryData.type || StorageService.get('planeType')) {
            angular.element('#plane-title').text(queryData.type || StorageService.get('planeType'));
            $timeout(function () {
                getPlaneList();
            }, 300);
        }
        if (queryData.id || queryData.flightno) {
            $timeout(function () {
                getPlaneDetail();
            }, 300);
        }

        function getPlaneList() {
            var data = {
                page: page,
                pageSize: 10,
                type: queryData.type || StorageService.get('planeType')
            };
            NetworkService.get(UrlService.getUrl(URL.AIRJET_PLANE), data, function (response) {
                $scope.planeList = response.data.content;
                if (response.data.totalPages > page) {
                    page++;
                }
                if (transferData.plane && transferData.plane.length) {
                    $scope.planeList.map(function (item) {
                        for (var i = 0; i < transferData.plane.length; i++) {
                            if (item.id === transferData.plane[i].fleet) {
                                item.selected = true;
                            }
                        }
                    });
                }
                myApp.pullToRefreshDone();
            }, function () {
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function getPlaneDetail() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_PLANE) + '/' + (queryData.id || ('query/flightno/' + queryData.flightno)), null, function (response) {
                $scope.planeDetail = response.data;
                angular.element('#plane-detail-title').text(response.data.vendor.name + ' ' + response.data.flightNo);
                if (response.data.appearances) {
                    $scope.appearances = response.data.appearances.split(';');
                }

                /** 获取评论 **/
                $scope.score = $scope.planeDetail.score;
                $scope.productId = $scope.planeDetail.id;
                getLatestFirstComment();

            }, function () {
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function jumpInfo(data) {
            $scope.planeArr = [];
            if (data.every(function (item) {
                return item.selected === false;
            })) {
                NotificationService.alert.success('请至少选择一架飞机', null);
                return;
            }
            data.forEach(function (item) {
                if (item.selected) {
                    $scope.planeArr.push({ fleet: item.id });
                }
            });
            transferData.plane = $scope.planeArr;
            StorageService.put('plan', transferData);
            if(!StorageService.get('planeType')){
                StorageService.put('planeType', queryData.type);
            }
            mainView.router.loadPage('app/components/airjet/travel-info.html');
        };

        function jumpPlaneDetail(id) {
            mainView.router.loadPage('app/components/airjet/travel-plane-detail.html?id=' + id);
        };






        /** -评论- **/
        $scope.loading = false;
        $scope.comments = [];
        $scope.showMore = false;
        $scope.showMoreCommentAction = showMoreCommentAction;
        var CCPage = 1;
        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {
            if ($scope.loading) return;
            $scope.loading = true;
            getComments(CCPage);
        });

        function showMoreCommentAction() {
            $scope.showMore = !$scope.showMore;
            getComments(1);
        }

        function getLatestFirstComment() {
            CommentServer.getLatestComment($scope.productId, function (res) {

                var cs = res.data.content;
                if (cs.length > 0) {
                    $scope.comments = cs;
                }

            });
        }
        function getComments(page) {
            CommentServer.getComments($scope.productId, page, function (res) {
                var data = res.data.content;
                if (data && data.length > 0) {
                    //delete first
                    CCPage = CCPage + 1;
                    var result = data;
                    if (result.length > 0) {
                        if (1 === page) {
                            $scope.comments.shift();
                        }
                        $scope.comments = $scope.comments.concat(result);
                    }
                }
                $timeout(function () {
                    $scope.loading = false;
                }, 500);
            }, function (err) {
                $timeout(function () {
                    $scope.loading = false;
                }, 500);
            });
        }

        /** -end- **/




    }
})();