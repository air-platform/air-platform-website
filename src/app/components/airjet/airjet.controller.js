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
        var dreamLoading = false;
        var cityLoading = false;
        var cardLoading = false;
        var queryData = myApp.views[0].activePage.query;
        $scope.travelStrokeList = [{ departure: '请选择', arrival: '请选择' }];
        $scope.cityShow = 20;
        $scope.citySearch = '';
        $scope.citySelect = citySelect;
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
        }, 500);
        if(StorageService.get('travel')){
            $scope.travelStrokeList = StorageService.get('travel');
            $scope.travelStrokeList.forEach(function(item){
                if(item.date){
                    item.startTime = item.date;
                }
                if(item.passengers){
                    item.guestStart = item.passengers;
                }
            });
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
            $scope.hotList = [{"country":"中国","code4":"ZSNJ","code3":"NKG","name":"禄口","city":"南京"},{"country":"中国","code4":"ZBAA","code3":"PEK","name":"首都国际机场","city":"北京"},{"country":"中国","code4":"ZBTJ","code3":"TSN","name":"滨海","city":"天津"},{"country":"中国","code4":"ZSSZ","code3":"NULL","name":"光福","city":"苏州"},{"country":"中国","code4":"ZYTL","code3":"DLC","name":"周水子","city":"大连"},{"country":"中国","code4":"ZYTX","code3":"SHE","name":"桃仙","city":"沈阳"},{"country":"中国","code4":"ZLXY","code3":"XIY","name":"咸阳","city":"西安"},{"country":"中国","code4":"ZSSL","code3":"NULL","name":"龙华","city":"上海"},{"country":"中国","code4":"ZSAM","code3":"XMN","name":"高崎","city":"厦门"},{"country":"中国","code4":"ZSHC","code3":"HGH","name":"萧山","city":"杭州"},{"country":"中国","code4":"ZSJN","code3":"TNA","name":"遥墙","city":"济南"},{"country":"中国","code4":"ZSNB","code3":"NGB","name":"栎社","city":"宁波"},{"country":"中国","code4":"ZSQD","code3":"TAO","name":"流亭","city":"青岛"},{"country":"中国","code4":"ZUCK","code3":"CKG","name":"江北","city":"重庆"},{"country":"中国","code4":"ZUUU","code3":"CTU","name":"双流","city":"成都"},{"country":"中国","code4":"ZGSZ","code3":"SZX","name":"宝安","city":"深圳"},{"country":"中国","code4":"ZHHH","code3":"WUH","name":"天河","city":"武汉"},{"country":"中国","code4":"RCTP","code3":"TPE","name":"桃园国际","city":"台北"},{"country":"中国","code4":"ZJSY","code3":"SYX","name":"凤凰","city":"三亚"},{"country":"中国","code4":"VHHH","code3":"HKG","name":"香港","city":"香港"},{"country":"美国","code4":"KCAE","code3":"CAE","name":"哥伦比亚大都会机场","city":"哥伦比亚"},{"country":"美国","code4":"KMDW","code3":"MDW","name":"芝加哥米德韦","city":"芝加哥"},{"country":"美国","code4":"KJFK","code3":"JFK","name":"肯尼迪","city":"纽约"},{"country":"日本","code4":"RJNT","code3":"TOY","name":"富山","city":"富山"},{"country":"巴西","code4":"SBSP","code3":"CGH","name":"孔戈尼亚斯","city":"圣保罗"},{"country":"法国","code4":"NTAA","code3":"PPT","name":"法阿","city":"塔希提岛"},{"country":"意大利","code4":"LIRP","code3":"PSA","name":"圣基斯托","city":"比萨"},{"country":"俄罗斯","code4":"UIUU","code3":"UUD","name":"贝加尔国际机场","city":"乌兰乌德"},{"country":"韩国","code4":"RKSS","code3":"GMP","name":"首尔 金浦","city":"首尔 金浦"},{"country":"英国","code4":"EGCC","code3":"MAN","name":"曼彻斯特","city":"曼彻斯特"},{"country":"加拿大","code4":"CYQB","code3":"YQB","name":"魁北克/勒萨热国际机场","city":"魁北克"},{"country":"圣卢西亚","code4":"TLPL","code3":"UVF","name":"黑瓦诺拉国际机场","city":"圣卢西亚"}];
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CITY), null, function (response) {
                $scope.cityList = response.data.content;
                $scope.cityList.map(function (item) {
                    if (item.name.indexOf('机场') === -1) {
                        return item.name += '机场';
                    }
                });
                $scope.totalRecords = response.data.totalRecords;
            }, function () {
                myApp.alert('数据获取失败，请重试', null);
            });
        };

        function getCard() {
            if (cityLoading) return;
            cityLoading = true;
            var data = {
                page: cardPage,
                pageSize: 10
            };
            var cardArr = ['金', '尊享', '精英', '飞翔', '悠游', '翱翔']
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CARD), data, function (response) {
                var result = [];
                response.data.content.forEach(function (item) {
                    var status = true;
                    for (var i = 0; i < cardArr.length; i++) {
                        if (item.name.indexOf(cardArr[i]) !== -1) {
                            item.level = i + 1;
                            result.push(item)
                            status = false;
                        }
                    }
                    if (status) {
                        item.level = 0;
                        result.push(item)
                    }
                });
                result.reverse(function (){
                    return function(a,b){
                        return a.level - b.level;
                    };
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
            NetworkService.get(UrlService.getUrl(URL.AIRJET_RECOMMENDED), null, function (response) {
                $scope.recommendList = response.data;
            });
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