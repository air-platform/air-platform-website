/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope, $window, NotificationService, StorageService, NetworkService, UrlService, URL) {
        var page = 1;
        $scope.travelStrokeList = [{ departure: '请选择', destination: '请选择' }];
        $scope.reversal = reversal;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.jumpTourDetail = jumpTourDetail;
        $scope.datepicter = datepicter;
        angular.element('.pull-to-refresh-content').on('refresh', getCard);
        getCard();

        function getCard() {
            var data = {
                page: page,
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
                myApp.pullToRefreshDone();
            });
        };

        $scope.dreamFlyList = [{
            id:'1',
            createTime: '2017年04月07日',
            startTime: '13:00',
            endTime: '16:30',
            departure: '阿普雷顿',
            expired:false,
            destination: '北京',
            type: '湾流G550',
            model: '金鹿GX2812-001',
            guest: '16',
            aircraft: '00092842',
            machine: '77000',
            seat: '1300',
            least:{number: '3'}
        },{
            id:'2',
            createTime: '2017年04月07日',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            expired:true,
            destination: '北京',
            type: '湾流G550',
            model: '金鹿GX2812-001',
            guest: '16',
            aircraft: '00092842',
            machine: '666636',
            seat: '1300',
            least:{number: '3'}
        },{
            id:'3',
            createTime: '2017年04月07日',
            expired:false,
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            type: '湾流G550',
            model: '金鹿GX2812-001',
            guest: '16',
            aircraft: '00092842',
            machine: '77000',
            seat: '1300',
            least:{number: '3'}
        },{
            id:'4',
            createTime: '2017年04月07日',
            startTime: '13:00',
            expired:true,
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            type: '湾流G550',
            model: '金鹿GX2812-001',
            guest: '16',
            aircraft: '00092842',
            machine: '44265',
            seat: '1300',
            least:{number: '3'}
        },{
            id:'5',
            createTime: '2017年04月07日',
            startTime: '13:00',
            endTime: '16:30',
            expired:true,
            departure: '香港',
            destination: '北京',
            type: '湾流G550',
            model: '金鹿GX2812-001',
            guest: '16',
            aircraft: '00092842',
            machine: '34320000',
            seat: '2800',
            least:{number: '3'}
        }];


        $scope.recommendList = [{
            id:1,
            departure: '阿普雷顿（及其周边）',
            destination: '三亚',
            model: '金鹿航空 BBJ-002',
            startTime: '13:00',
            endTime: '16:30',
            people: '3人',
            order: '993028363001',
            time: '2017-05-16',
            money: '¥60万'
        }, {
            id:2,
            departure: '阿普雷顿（及其周边）',
            destination: '北京',
            model: '金鹿航空 BBJ-002',
            startTime: '13:00',
            endTime: '16:30',
            people: '3人',
            order: '993028364021',
            time: '2017-05-16',
            money: '¥60万'
        }, {
            id:3,
            departure: '香港',
            destination: '北京',
            model: '金鹿航空 BBJ-002',
            startTime: '13:00',
            endTime: '16:30',
            people: '3人',
            order: '993028364001',
            time: '2017-05-01',
            money: '¥60万'
        }];

        $scope.cityList = [{
            name: '北京首都',
            value: 'beijing'
        },{
            name: '三亚凤凰',
            value: 'sanya'
        }];

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