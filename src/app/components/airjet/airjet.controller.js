/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope, $timeout, NotificationService, StorageService, NetworkService, UrlService, URL) {
        var cardPage = 1;
        var dreamPage = 1;
        var cityPage = 1;
        var loading = false;
        var queryData = myApp.views[0].activePage.query;
        $scope.travelStrokeList = [{ departure: '请选择', destination: '请选择' }];
        $scope.cityShow = 20;
        $scope.citySearch = '';
        $scope.citySelect = citySelect;
        $scope.reversal = reversal;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.jumpDream = jumpDream;
        $scope.jumpTourDetail = jumpTourDetail;
        $scope.datepicter = datepicter;
        $scope.tabActive = queryData.tabActive || 'tab1';
        angular.element('.card-tab').on('refresh', getCard);
        angular.element('.dream-tab').on('refresh', getDream);
        angular.element('.infinite-scroll').on('infinite', infinite);
        $scope.$watch('citySearch', search);
        $timeout(function () {
            if(mainView.activePage.name === 'airjet') {
                getCard();
                getDream();
                getRecommended();
            } else {
                getCity();
            }
        }, 200);
        if(StorageService.get('travel')){
            $scope.travelStrokeList = StorageService.get('travel');
        }

        function search(newValue, oldValue) {
            $scope.cityShow = 20;
            angular.element('.infinite-scroll-preloader').show();
            if (newValue !== oldValue) {
                $scope.searchList = [];
                $scope.cityList.forEach(function (item) {
                    for (var key in item) {
                        if (key !== 'id' && key !== '$$hashKey' && item[key] && angular.lowercase(item[key]).indexOf(angular.lowercase(newValue)) !== -1) {
                            $scope.searchList.push(item);
                            return;
                        }
                    }
                });
            }
            if ($scope.searchList) {
                $scope.totalRecords = $scope.searchList.length;
                if ($scope.cityShow >= $scope.totalRecords) {
                    // myApp.detachInfiniteScroll(angular.element('.infinite-scroll'));
                    angular.element('.infinite-scroll-preloader').hide();
                    return;
                }
            }
        };

        function infinite() {
            if (loading) return;
            loading = true;
            $timeout(function () {
                loading = false;
                if ($scope.cityShow >= $scope.totalRecords) {
                    // myApp.detachInfiniteScroll(angular.element('.infinite-scroll'));
                    angular.element('.infinite-scroll-preloader').hide();
                    return;
                }
                cityPage++;
                $scope.cityShow = 20 * cityPage;
            }, 1000);
        };

        function citySelect(item) {
            if(queryData.index && queryData.name){
                if(!$scope.travelStrokeList[queryData.index]) {
                    $scope.travelStrokeList[queryData.index] = { departure: '请选择', destination: '请选择' };
                }
                $scope.travelStrokeList[queryData.index][queryData.name] = item.city;
            }
            StorageService.put('travel', $scope.travelStrokeList);
            mainView.router.loadPage('app/components/airjet/airjet.html?tabActive=tab1');
        };

        function getCity() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CITY), null, function (response) {
                $scope.cityList = response.data.content;
                $scope.cityList.map(function (item) {
                    if (item.name.indexOf('机场') === -1) {
                        return item.name += '机场';
                    }
                })
                $scope.totalRecords = response.data.totalRecords;
            }, function () {
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function getCard() {
            var data = {
                page: cardPage,
                pageSize: 10
            };
            var cardArr = ['金', '钻石', '尊享', '精英', '飞翔', '悠游', '翱翔']
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CARD), data, function (response) {
                var result = [];
                response.data.content.forEach(function (item) {
                    var status = true;
                    for (var i = 0; i < cardArr.length; i++) {
                        if (item.name.indexOf(cardArr[i]) !== -1) {
                            item.level = i + 1;
                            if (result[i]) {
                                result.splice(i, 0, item);
                            } else {
                                result[i] = item;
                            }
                            status = false;
                        }
                    }
                    if (status) {
                        item.level = 0;
                        if(result[3]){
                            result.splice(4, 0, item);
                        } else {
                            result[3] = item;
                        }
                    }
                });
                $scope.cardList = result;
                if (response.data.totalPages > cardPage) {
                    cardPage++;
                }
                myApp.pullToRefreshDone();
            });
        };

        function getDream() {
            var data = {
                page: dreamPage,
                pageSize: 10
            };
            NetworkService.get(UrlService.getUrl(URL.AIRJET_DREAM), null, function (response) {
                response.data.content.map(function (item) {
                    if (item.timeSlot) {
                        item.startTime = item.timeSlot.split('-')[0];
                        item.endTime = item.timeSlot.split('-')[1];
                    }
                    if (item.minPassengers) {
                        item.least = { number: item.minPassengers }
                    }
                    if (new Date(item.date).getTime() - new Date().getTime() < 0) {
                        item.expired = true;
                    }
                })
                $scope.dreamFlyList = response.data.content;
                if (response.data.totalPages > dreamPage) {
                    dreamPage++;
                }
                myApp.pullToRefreshDone();
            });
        };

        function getRecommended() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_RECOMMENDED), null, function (response) {
                $scope.recommendList = response.data;
            });
        };

        function reversal(item, order) {
            var local = item.departure;
            $scope.travelStrokeList.map(function (opt, index) {
                if (order === index) {
                    opt.departure = opt.destination;
                    opt.destination = local;
                    return;
                }
            });
            StorageService.put('travel', $scope.travelStrokeList);
        };

        function submit(data, status) {
            var base = [];
            if (data) {
                var valid = true;
                data.map(function (item) {
                    if (item.departure === '请选择') {
                        NotificationService.alert.success('请选择出发城市', null);
                        valid = false;
                        return;
                    }
                    if (item.destination === '请选择') {
                        NotificationService.alert.success('请选择到达城市', null);
                        valid = false;
                        return;
                    }
                    if (!item.startTime) {
                        NotificationService.alert.success('请选择出发时间', null);
                        valid = false;
                        return;
                    }
                    if (!item.guestStart) {
                        NotificationService.alert.success('请填写乘客人数', null);
                        valid = false;
                        return;
                    }
                    base.push({
                        "departure": item.departure,
                        "arrival": item.destination,
                        "date": item.startTime,
                        "passengers": item.guestStart
                    });
                    if (item.round) {
                        if (!item.endTime) {
                            NotificationService.alert.success('请选择返程出发时间', null);
                            valid = false;
                            return;
                        }
                        if (!item.guestEnd) {
                            NotificationService.alert.success('请填写返程乘客人数', null);
                            valid = false;
                            return;
                        }
                        base.push({
                            "departure": item.destination,
                            "arrival": item.departure,
                            "date": item.endTime,
                            "passengers": item.guestEnd
                        });
                    }

                });
                if (valid) {
                    StorageService.put('travel', base);
                    StorageService.put('plan', { base: base });
                    if (status) {
                        mainView.router.loadPage('app/components/airjet/travel-info.html');
                    } else {
                        mainView.router.loadPage('app/components/airjet/travel-model.html');
                    }
                }
            }
        };

        function addCard() {
            $scope.travelStrokeList.push({ departure: '请选择', destination: '请选择' });
            StorageService.put('travel', $scope.travelStrokeList);
        };

        function removeCard(index) {
            $scope.travelStrokeList.splice(index, 1);
            StorageService.put('travel', $scope.travelStrokeList);
        };

        function jumpDream(data) {
            if (data.id && !data.expired) {
                mainView.router.loadPage('app/components/airjet/dream-inner.html?id=' + data.id)
            }
        };

        function jumpTourDetail(data) {
            if (data.id) {
                mainView.router.loadPage('app/components/airjet/tour-detail.html?id=' + data.id)
            }
        };

        function datepicter(name, index) {
            var calendar = myApp.calendar({
                input: '.' + name + index,
                disabled: {
                    to: new Date().setDate(new Date().getDate() - 1)
                },
                onDayClick: function () {
                    calendar.close();
                }
            });
        };
    }

})();