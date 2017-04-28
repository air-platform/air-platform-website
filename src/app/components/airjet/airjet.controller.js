/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope, $timeout, NotificationService, StorageService, NetworkService, UrlService, URL, CITYLIST, CITYHOT, DATEPICKER, REGEX, constdata) {
        var cardPage = 1;
        var dreamPage = 1;
        var cityPage = 1;
        var dreamLoading = false;
        var cityLoading = false;
        var cardLoading = false;
        var queryData = myApp.views[0].activePage.query;
        var visited = StorageService.get(constdata.cookie.airjet.dream_visited);
        $scope.travelStrokeList = [{ departure: '请选择', arrival: '请选择' }];
        $scope.cityShow = 20;
        $scope.citySearch = '';
        $scope.citySelect = citySelect;
        $scope.tabSwitch = tabSwitch;
        $scope.roundChange = roundChange;
        $scope.reversal = reversal;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.jumpDream = jumpDream;
        $scope.jumpTourDetail = jumpTourDetail;
        $scope.jumpCity = jumpCity;
        $scope.datepicter = datepicter;
        $scope.$watch('citySearch', search);
        $timeout(function () {
            if(mainView.activePage.name === 'smart-select-radio-travel') {
                getCity();
                angular.element('.city-infinite').on('infinite', cityInfinite);
            } else {
                getRecommended();
                if(StorageService.get(constdata.cookie.airjet.tab)){
                    tabSwitch(StorageService.get(constdata.cookie.airjet.tab));
                }
                if(queryData.tabActive){
                    tabSwitch('#' + queryData.tabActive);
                }
            }
        }, 300);
        if(StorageService.get(constdata.cookie.airjet.travel_base)){
            $scope.travelStrokeList = StorageService.get(constdata.cookie.airjet.travel_base);
        }
        if(queryData.index && queryData.name){
            $scope.currentCity = $scope.travelStrokeList[queryData.index][queryData.name];
        }
        

        function search(newValue, oldValue) {
            $scope.cityShow = 20;
            angular.element('.city-scroll-preloader').show();
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
            StorageService.put(constdata.cookie.airjet.travel_base, $scope.travelStrokeList);
            mainView.router.back({url: 'app/components/airjet/airjet.html', force: true, pushState: false});
        };

        function getCity() {
            $scope.hotList = CITYHOT;
            $scope.hotList.map(function (item, index) {
                if (item.name.indexOf('机场') === -1) {
                    return item.name += '机场';
                }
                if(queryData.index && queryData.name){
                    if(queryData.name === 'departure'){
                        var arrival = $scope.travelStrokeList[queryData.index]['arrival'];
                        if(arrival !== '请选择' && item.city === arrival){
                            $scope.hotList.splice(index, 1);
                        }
                    } else {
                        var departure = $scope.travelStrokeList[queryData.index]['departure'];
                        if(departure !== '请选择' && item.city === departure){
                            $scope.hotList.splice(index, 1);
                        }
                    }
                }
            });
            $scope.totalRecords = $scope.hotList.length;
            // NetworkService.get(UrlService.getUrl(URL.AIRJET_CITY), null, function (response) {
                // $scope.cityList = response.data.content;
                $scope.cityList = CITYLIST;
                $scope.cityList.map(function (item, index) {
                    if (item.name.indexOf('机场') === -1) {
                        return item.name += '机场';
                    }
                    if(queryData.index && queryData.name){
                        if(queryData.name === 'departure'){
                            var arrival = $scope.travelStrokeList[queryData.index]['arrival'];
                            if(arrival !== '请选择' && item.city === arrival){
                                $scope.cityList.splice(index, 1);
                            }
                        } else {
                            var departure = $scope.travelStrokeList[queryData.index]['departure'];
                            if(departure !== '请选择' && item.city === departure){
                                $scope.cityList.splice(index, 1);
                            }
                        }
                    }
                });
            // }, function () {
            //     myApp.alert('数据获取失败，请重试', null);
            // });
        };

        function getCard() {
            angular.element('.airjet-infinite-preloader').show();
            if ($scope.cardEnd){
                angular.element('.airjet-infinite-preloader').hide();
                return;
            }
            if (cardLoading) return;
            cardLoading = true;
            var data = {
                page: 1,
                pageSize: 10 * cardPage
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
                if(response.data.totalRecords > cardPage * 10) {
                    cardPage++;
                } else {
                    $scope.cardEnd = true;
                    angular.element('.airjet-infinite-preloader').hide();
                }
                cardLoading = false;
            });
        };

        function getDream() {
            angular.element('.airjet-infinite-preloader').show();
            if ($scope.dreamEnd){
                angular.element('.airjet-infinite-preloader').hide();
                return;
            }
            if (dreamLoading) return;
            dreamLoading = true;
            var data = {
                page: 1,
                pageSize: 10 *　dreamPage
            };
            NetworkService.get(UrlService.getUrl(URL.AIRJET_DREAM), null, function (response) {
                var result = [];
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
                    if(visited && visited.indexOf(item.id) !== -1 && !item.expired) {
                        item.visited = true;
                    }
                });
                $scope.dreamFlyList = response.data.content;
                if(response.data.totalRecords > dreamPage * 10) {
                    dreamPage++;
                } else {
                    $scope.dreamEnd = true;
                    angular.element('.airjet-infinite-preloader').hide();
                }
                dreamLoading = false;
            });
        };

        function getRecommended() {
            angular.element('.airjet-infinite-preloader').hide();
            $scope.recommendList = [];
            NetworkService.get(UrlService.getUrl(URL.AIRJET_RECOMMENDED), null, function (response) {
                response.data.forEach(function(item) {
                    if(new Date(item.date).getTime() - new Date().getTime() > 0) {
                        $scope.recommendList.push(item);
                    }
                });
            });
        };

        function tabSwitch(tab) {
            angular.element('.airjet-infinite').off('infinite');
            if(tab === '#dream-flying') {
                getDream();
                angular.element('.airjet-infinite').on('infinite', getDream);
            } else if(tab === '#card-sevice') {
                getCard();
                angular.element('.airjet-infinite').on('infinite', getCard);
            } else {
                angular.element('.airjet-infinite-preloader').hide();
            }
            myApp.showTab(tab);
            StorageService.put(constdata.cookie.airjet.tab, tab);
        };

        function roundChange(index){
            $scope.travelStrokeList[index].round = !$scope.travelStrokeList[index].round;
            StorageService.put(constdata.cookie.airjet.travel_base, $scope.travelStrokeList);
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
            StorageService.put(constdata.cookie.airjet.travel_base, $scope.travelStrokeList);
        };

        function submit(data, status) {
            var base = [];
            if (data) {
                var valid = true;
                data.map(function (item) {
                    if (item.departure === '请选择' && valid) {
                        NotificationService.alert.success('请选择出发城市', null);
                        valid = false;
                        return;
                    }
                    if (item.arrival === '请选择' && valid) {
                        NotificationService.alert.success('请选择到达城市', null);
                        valid = false;
                        return;
                    }
                    if (!item.startTime && valid) {
                        NotificationService.alert.success('请选择出发时间', null);
                        valid = false;
                        return;
                    }
                    if (!item.guestStart && valid) {
                        NotificationService.alert.success('请填写乘客人数', null);
                        valid = false;
                        return;
                    }
                    if(!REGEX.NUMBER.test(item.guestStart)){
                        NotificationService.alert.success('请填写四位以下的数字', null);
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
                        if (!item.endTime && valid) {
                            NotificationService.alert.success('请选择返程出发时间', null);
                            valid = false;
                            return;
                        }
                        if (!item.guestEnd && valid) {
                            NotificationService.alert.success('请填写返程乘客人数', null);
                            valid = false;
                            return;
                        }
                        if(!REGEX.NUMBER.test(item.guestEnd)){
                            NotificationService.alert.success('请填写四位以下的数字', null);
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
                    StorageService.put(constdata.cookie.airjet.travel_base, $scope.travelStrokeList);
                    StorageService.put(constdata.cookie.airjet.travel, { base: base });
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
            StorageService.put(constdata.cookie.airjet.travel_base, $scope.travelStrokeList);
        };

        function removeCard(index) {
            $scope.travelStrokeList.splice(index, 1);
            StorageService.put(constdata.cookie.airjet.travel_base, $scope.travelStrokeList);
        };

        function jumpDream(data) {
            if (data.id && !data.expired) {
                if(visited && visited.indexOf(data.id) === -1) {
                    StorageService.put(constdata.cookie.airjet.dream_visited, visited + ',' + data.id);
                } else {
                    StorageService.put(constdata.cookie.airjet.dream_visited, data.id);
                }
                $scope.dreamFlyList.map(function (item) {
                    if(data.id === item.id) {
                        item.visited = true;
                    }
                });
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
                StorageService.put(constdata.cookie.airjet.travel_base, $scope.travelStrokeList);
                mainView.router.load({url:'app/components/airjet/travel-city.html?index=' + index + '&name=' + name, pushState: false})
            }
        };

        function datepicter(name, index) {
            var currentData = $scope.travelStrokeList[index];
            if(name === "datepicter"){
                $scope.disabledDate = new Date().setDate(new Date().getDate() - 1);
            }
   
            var calendar = myApp.calendar({
                input: '.' + name + index,
                disabled: {
                    to: $scope.disabledDate
                },
                monthNames: DATEPICKER.monthNames,
                dayNamesShort: DATEPICKER.dayNamesShort,
                onDayClick: function (c, ele, year, m, d) {
                    var month = m < 10 ? '0' + (Number(m) + 1) : (Number(m) + 1);
                    var day = d < 10 ? '0' + d : d;
                    var startDate = year + '/' + month + '/' + day;
                    if(name === "datepicter"){
                        if(currentData.endTime) {
                            if((year + month + day) > currentData.endTime.split('-').join('')) {
                                $scope.travelStrokeList[index].endTime = undefined;
                            }
                        }
                        $scope.disabledDate = new Date(startDate).setDate(new Date(startDate).getDate() - 1);
                    }
                    calendar.close();
                    calendar.destroy();
                }
            });
            calendar.open();
        };
    }
    
})();