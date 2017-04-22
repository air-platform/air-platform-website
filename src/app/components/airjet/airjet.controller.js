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
        var queryData = myApp.views[0].activePage.query;
        $scope.travelStrokeList = [{ departure: '请选择', destination: '请选择' }];
        $scope.reversal = reversal;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.jumpTourDetail = jumpTourDetail;
        $scope.datepicter = datepicter;
        $scope.tabActive = queryData.tabActive || 'tab1';
        angular.element('.card-tab').on('refresh', getCard);
        angular.element('.dream-tab').on('refresh', getDream);
        $timeout(function(){
            getCard();
            getDream();
            getRecommended();
        },200);

        $scope.cityList = [{"country":"中国","code4":"ZSNJ","code3":"NKG","airport":"禄口","name":"南京"},{"country":"中国","code4":"ZBAA","code3":"PEK","airport":"首都国际机场","name":"北京"},{"country":"中国","code4":"ZBTJ","code3":"TSN","airport":"滨海","name":"天津"},{"country":"中国","code4":"ZSSZ","code3":"NULL","airport":"光福","name":"苏州"},{"country":"中国","code4":"ZYTL","code3":"DLC","airport":"周水子","name":"大连"},{"country":"中国","code4":"ZYTX","code3":"SHE","airport":"桃仙","name":"沈阳"},{"country":"中国","code4":"ZLXY","code3":"XIY","airport":"咸阳","name":"西安"},{"country":"中国","code4":"ZSSL","code3":"NULL","airport":"龙华","name":"上海"},{"country":"中国","code4":"ZSAM","code3":"XMN","airport":"高崎","name":"厦门"},{"country":"中国","code4":"ZSHC","code3":"HGH","airport":"萧山","name":"杭州"},{"country":"中国","code4":"ZSJN","code3":"TNA","airport":"遥墙","name":"济南"},{"country":"中国","code4":"ZSNB","code3":"NGB","airport":"栎社","name":"宁波"},{"country":"中国","code4":"ZSQD","code3":"TAO","airport":"流亭","name":"青岛"},{"country":"中国","code4":"ZUCK","code3":"CKG","airport":"江北","name":"重庆"},{"country":"中国","code4":"ZUUU","code3":"CTU","airport":"双流","name":"成都"},{"country":"中国","code4":"ZGSZ","code3":"SZX","airport":"宝安","name":"深圳"},{"country":"中国","code4":"ZHHH","code3":"WUH","airport":"天河","name":"武汉"},{"country":"中国","code4":"RCTP","code3":"TPE","airport":"桃园国际","name":"台北"},{"country":"中国","code4":"ZJSY","code3":"SYX","airport":"凤凰","name":"三亚"},{"country":"中国","code4":"VHHH","code3":"HKG","airport":"香港","name":"香港"},{"country":"美国","code4":"KCAE","code3":"CAE","airport":"哥伦比亚大都会机场","name":"哥伦比亚"},{"country":"美国","code4":"KMDW","code3":"MDW","airport":"芝加哥米德韦","name":"芝加哥"},{"country":"美国","code4":"KJFK","code3":"JFK","airport":"肯尼迪","name":"纽约"},{"country":"日本","code4":"RJNT","code3":"TOY","airport":"富山","name":"富山"},{"country":"巴西","code4":"SBSP","code3":"CGH","airport":"孔戈尼亚斯","name":"圣保罗"},{"country":"法国","code4":"NTAA","code3":"PPT","airport":"法阿","name":"塔希提岛"},{"country":"意大利","code4":"LIRP","code3":"PSA","airport":"圣基斯托","name":"比萨"},{"country":"俄罗斯","code4":"UIUU","code3":"UUD","airport":"贝加尔国际机场","name":"乌兰乌德"},{"country":"韩国","code4":"RKSS","code3":"GMP","airport":"首尔 金浦","name":"首尔 金浦"},{"country":"英国","code4":"EGCC","code3":"MAN","airport":"曼彻斯特","name":"曼彻斯特"},{"country":"加拿大","code4":"CYQB","code3":"YQB","airport":"魁北克/勒萨热国际机场","name":"魁北克"},{"country":"圣卢西亚","code4":"TLPL","code3":"UVF","airport":"黑瓦诺拉国际机场","name":"圣卢西亚"}];

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
                    if(new Date(item.date).getTime() - new Date().getTime() < 0){
                        item.expired = true;
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