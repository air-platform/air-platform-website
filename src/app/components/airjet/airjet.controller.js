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
        $scope.travelStrokeList = [{ departure: '请选择', destination: '请选择' }];
        $scope.reversal = reversal;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.jumpTourDetail = jumpTourDetail;
        $scope.datepicter = datepicter;
        angular.element('.card-tab').on('refresh', getCard);
        angular.element('.dream-tab').on('refresh', getDream);
        $timeout(function(){
            getCard();
            getDream();
            getRecommended();
        },200);

        $scope.cityList = [{
            name: '北京首都',
            value: 'beijing'
        },{
            name: '三亚凤凰',
            value: 'sanya'
        }];

        function getCard() {
            var data = {
                page: cardPage,
                pageSize: 10
            };
            var cardArr = ['金', '钻石', '尊享', '精英', '飞翔', '悠游', '翱翔']
            NetworkService.get(UrlService.getUrl(URL.AIRJET_CARD), data, function(response) {
                var result = [];
                response.data.content.forEach(function(item) {
                    var status = true;
                    for(var i = 0; i < cardArr.length; i++) {
                        if(item.name.indexOf(cardArr[i]) !== -1) {
                            item.level = i + 1;
                            if(result[i]) {
                                result.push(item);
                            } else {
                                result[i] = item;
                            }
                            status = false;
                        }
                    }
                    if(status) {
                        item.level = 0;
                        result.push(item);
                    }
                });
                $scope.cardList = result;
                if(response.data.totalPages > cardPage){
                    cardPage ++;
                }
                myApp.pullToRefreshDone();
            });
        };

        function getDream() {
            var data = {
                page: dreamPage,
                pageSize: 10
            };
            NetworkService.get(UrlService.getUrl(URL.AIRJET_DREAM), null, function(response) {
                response.data.content.map(function(item) {
                    if(item.timeSlot){
                        item.startTime = item.timeSlot.split('-')[0];
                        item.endTime = item.timeSlot.split('-')[1];
                    }
                    if(item.minPassengers){
                        item.least = { number: item.minPassengers }
                    }
                })
                $scope.dreamFlyList = response.data.content;
                if(response.data.totalPages > dreamPage){
                    dreamPage ++;
                }
                myApp.pullToRefreshDone();
            });
        };

        function getRecommended() {
            NetworkService.get(UrlService.getUrl(URL.AIRJET_RECOMMENDED), null, function(response) {
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
            })
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
                if(valid){
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
        };

        function removeCard(index) {
            $scope.travelStrokeList.splice(index, 1);
        };

        function jumpTourDetail(data) {
            if(data.id){
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