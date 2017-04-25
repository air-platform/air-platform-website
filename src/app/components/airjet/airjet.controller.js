/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope, $timeout, NotificationService, StorageService, NetworkService, UrlService, URL, CITYLIST, CITYHOT) {
        var cardPage = 1;
        var dreamPage = 1;
        var cityPage = 1;
        var dreamLoading = false;
        var cityLoading = false;
        var cardLoading = false;
        var queryData = myApp.views[0].activePage.query;
        $scope.travelStrokeList = [{ departure: '请选择', arrival: '请选择' }];
        $scope.cityShow = 20;
        $scope.citySearch = '';
        $scope.citySelect = citySelect;
        $scope.roundChange = roundChange;
        $scope.reversal = reversal;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.jumpDream = jumpDream;
        $scope.jumpTourDetail = jumpTourDetail;
        $scope.jumpCity = jumpCity;
        $scope.datepicter = datepicter;
        $scope.tabActive = queryData.tabActive || 'tab1';
        angular.element('.card-infinite').on('infinite', getCard);
        angular.element('.dream-infinite').on('infinite', getDream);
        angular.element('.infinite-scroll').on('infinite', cityInfinite);
        $scope.$watch('citySearch', search);
        $timeout(function () {
            if(mainView.activePage.name === 'smart-select-radio-travel') {
                getCity();
            } else {
                getCard();
                getDream();
                getRecommended();
            }
        }, 300);
        if(StorageService.get('travel')){
            $scope.travelStrokeList = StorageService.get('travel');
        }
        if(queryData.index && queryData.name){
            $scope.currentCity = $scope.travelStrokeList[queryData.index][queryData.name];
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
                    angular.element('.city-infinite-preloader').hide();
                    return;
                }
            }
        };

        function cityInfinite() {
            if (cityLoading) return;
            cityLoading = true;
            $timeout(function () {
                cityLoading = false;
                if ($scope.cityShow >= $scope.totalRecords) {
                    angular.element('.city-infinite-preloader').hide();
                    return;
                }
                cityPage++;
                $scope.cityShow = 20 * cityPage;
            }, 1000);
        };

        function citySelect(item) {
            if(queryData.index && queryData.name){
                if(!$scope.travelStrokeList[queryData.index]) {
                    $scope.travelStrokeList[queryData.index] = { departure: '请选择', arrival: '请选择' };
                }
                $scope.travelStrokeList[queryData.index][queryData.name] = item.city;
            }
            StorageService.put('travel', $scope.travelStrokeList);
            mainView.router.back({url: 'app/components/airjet/airjet.html', force: true, pushState: false});
        };

        function getCity() {
            $scope.hotList = CITYHOT;
            $scope.hotList.map(function (item) {
                if (item.name.indexOf('机场') === -1) {
                    return item.name += '机场';
                }
            });
            $scope.totalRecords = $scope.hotList.length;
            // NetworkService.get(UrlService.getUrl(URL.AIRJET_CITY), null, function (response) {
                // $scope.cityList = response.data.content;
                $scope.cityList = CITYLIST;
                $scope.cityList.map(function (item) {
                    if (item.name.indexOf('机场') === -1) {
                        return item.name += '机场';
                    }
                });
            // }, function () {
            //     myApp.alert('数据获取失败，请重试', null);
            // });
        };

        function getCard() {
            if (cityLoading) return;
            cityLoading = true;
            var data = {
                page: cardPage,
                pageSize: 10
            };
            var cardArr = ['金', '尊享', '精英', '飞翔', '悠', '翱翔'];
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CARD), data, function (response) {
                var result = [];
                response.data.content.forEach(function (item) {
                    var status = true;
                    for (var i = 0; i < cardArr.length; i++) {
                        if (item.name.indexOf(cardArr[i]) !== -1) {
                            if(i < 3){
                                item.level = i;
                            } else {
                                item.level = i + 1;
                            }
                            status = false;
                        }
                    }
                    if (status) {
                        item.level = 3;
                    }
                    result.push(item);
                });
                $scope.cardList = result;
                if (response.data.totalPages > cardPage) {
                    cardPage++;
                } else {
                    myApp.detachInfiniteScroll(angular.element('.card-infinite'));
                    angular.element('.card-infinite-preloader').remove();
                }
                cityLoading = false;
            });
        };

        function getDream() {
            if (dreamLoading) return;
            dreamLoading = true;
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
                } else {
                    myApp.detachInfiniteScroll(angular.element('.dream-infinite'));
                    angular.element('.dream-infinite-preloader').remove();
                }
                dreamLoading = false;
            });
        };

        function getRecommended() {
            $scope.recommendList = [];
            NetworkService.get(UrlService.getUrl(URL.AIRJET_RECOMMENDED), null, function (response) {
                response.data.forEach(function(item) {
                    if(new Date(item.date).getTime() - new Date().getTime() > 0) {
                        $scope.recommendList.push(item);
                    }
                });
            });
        };

        function roundChange(index){
            $scope.travelStrokeList[index].round = !$scope.travelStrokeList[index].round;
            StorageService.put('travel', $scope.travelStrokeList);
        };

        function reversal(item, order) {
            var local = item.departure;
            $scope.travelStrokeList.map(function (opt, index) {
                if (order === index) {
                    opt.departure = opt.arrival;
                    opt.arrival = local;
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
                    if (item.arrival === '请选择') {
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
                        "arrival": item.arrival,
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
                            "departure": item.arrival,
                            "arrival": item.departure,
                            "date": item.endTime,
                            "passengers": item.guestEnd
                        });
                    }

                });
                if (valid) {
                    StorageService.put('travel', $scope.travelStrokeList);
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
            $scope.travelStrokeList.push({ departure: '请选择', arrival: '请选择' });
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

        function jumpCity(index, name) {
            if (angular.isNumber(index) && name) {
                StorageService.put('travel', $scope.travelStrokeList);
                mainView.router.load({url:'app/components/airjet/travel-city.html?index=' + index + '&name=' + name, pushState: false})
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