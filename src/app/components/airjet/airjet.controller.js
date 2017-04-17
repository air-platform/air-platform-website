/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope, $window, NotificationService) {
        $scope.travelStrokeList = [{ departure: '请选择', destination: '请选择' }];
        $scope.reversal = reversal;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.jumpTourDetail = jumpTourDetail;
        $scope.datepicter = datepicter;

        $scope.cardList = [{
            name: '金鹿 FBO',
            type_cn: '铂金卡',
            type_en: 'Platinum Card',
            official: '公务机，一种新的出行方式。不再迁就航班，不再忍受延误，用效率丈量金钱， 用金钱换取时间。',
            hour: '小时卡，一种更有价值的公务机体验。远离昂贵的购机，远离复杂的包机。用时间商定价格，用价格优化效率。',
            feature: [{
                name: '更划算',
                value: ['10小时即可起步，准入门槛低', '小时单价远低于市场价', '国际、国内调机单位小时价格一致']
            },{
                name: '更透明',
                value: ['仅以飞行时间结算，让客户一目了然', '不再为每次飞行前反复询价、比价、议价而烦恼', '卡内飞行小时无使用有效期，只要有余额即有效']
            },{
                name: '更多元',
                value: ['10小时、25小时、50小时多卡种，满足不同需求', '一卡在手，多种机型随意选', '附赠多项免费权益（加急费、免费升机型、全球医疗救援服务）', '不仅可以包机，还可以坐游艇，一卡多服务', '续新卡还额外赠送飞行小时，多买多得']
            }],
            money: 'RMB 1,000,000',
            level: 1
        }, {
            name: '金鹿 FBO',
            type_cn: '钻石卡',
            type_en: 'Diamond Card',
            official: '公务机，一种新的出行方式。不再迁就航班，不再忍受延误，用效率丈量金钱， 用金钱换取时间。',
            hour: '小时卡，一种更有价值的公务机体验。远离昂贵的购机，远离复杂的包机。用时间商定价格，用价格优化效率。',
            feature: [{
                name: '更划算',
                value: ['10小时即可起步，准入门槛低', '小时单价远低于市场价', '国际、国内调机单位小时价格一致']
            },{
                name: '更透明',
                value: ['仅以飞行时间结算，让客户一目了然', '不再为每次飞行前反复询价、比价、议价而烦恼', '卡内飞行小时无使用有效期，只要有余额即有效']
            },{
                name: '更多元',
                value: ['10小时、25小时、50小时多卡种，满足不同需求', '一卡在手，多种机型随意选', '附赠多项免费权益（加急费、免费升机型、全球医疗救援服务）', '不仅可以包机，还可以坐游艇，一卡多服务', '续新卡还额外赠送飞行小时，多买多得']
            }],
            money: 'USD 1,000',
            level: 2
        }, {
            name: '金鹿 FBO',
            type_cn: '尊享卡',
            type_en: 'Honor Card',
            money: 'RMB 5,00,000',
            official: '公务机，一种新的出行方式。不再迁就航班，不再忍受延误，用效率丈量金钱， 用金钱换取时间。',
            hour: '小时卡，一种更有价值的公务机体验。远离昂贵的购机，远离复杂的包机。用时间商定价格，用价格优化效率。',
            feature: [{
                name: '更划算',
                value: ['10小时即可起步，准入门槛低', '小时单价远低于市场价', '国际、国内调机单位小时价格一致']
            },{
                name: '更透明',
                value: ['仅以飞行时间结算，让客户一目了然', '不再为每次飞行前反复询价、比价、议价而烦恼', '卡内飞行小时无使用有效期，只要有余额即有效']
            },{
                name: '更多元',
                value: ['10小时、25小时、50小时多卡种，满足不同需求', '一卡在手，多种机型随意选', '附赠多项免费权益（加急费、免费升机型、全球医疗救援服务）', '不仅可以包机，还可以坐游艇，一卡多服务', '续新卡还额外赠送飞行小时，多买多得']
            }],
            level: 3
        }, {
            name: '金鹿 FBO',
            type_cn: '精英卡',
            type_en: 'Elite Card',
            money: 'RMB 5,00,000',
            official: '公务机，一种新的出行方式。不再迁就航班，不再忍受延误，用效率丈量金钱， 用金钱换取时间。',
            hour: '小时卡，一种更有价值的公务机体验。远离昂贵的购机，远离复杂的包机。用时间商定价格，用价格优化效率。',
            feature: [{
                name: '更划算',
                value: ['10小时即可起步，准入门槛低', '小时单价远低于市场价', '国际、国内调机单位小时价格一致']
            },{
                name: '更透明',
                value: ['仅以飞行时间结算，让客户一目了然', '不再为每次飞行前反复询价、比价、议价而烦恼', '卡内飞行小时无使用有效期，只要有余额即有效']
            },{
                name: '更多元',
                value: ['10小时、25小时、50小时多卡种，满足不同需求', '一卡在手，多种机型随意选', '附赠多项免费权益（加急费、免费升机型、全球医疗救援服务）', '不仅可以包机，还可以坐游艇，一卡多服务', '续新卡还额外赠送飞行小时，多买多得']
            }],
            level: 4
        }];

        $scope.hourCardList = [{
            name: '金鹿 小时卡',
            type: '飞翔卡',
            description: '10小时专享按小时计费的公务机消费模式',
            money: 'RMB 788,888',
            official: '公务机，一种新的出行方式。不再迁就航班，不再忍受延误，用效率丈量金钱， 用金钱换取时间。',
            hour: '小时卡，一种更有价值的公务机体验。远离昂贵的购机，远离复杂的包机。用时间商定价格，用价格优化效率。',
            feature: [{
                name: '更划算',
                value: ['10小时即可起步，准入门槛低', '小时单价远低于市场价', '国际、国内调机单位小时价格一致']
            },{
                name: '更透明',
                value: ['仅以飞行时间结算，让客户一目了然', '不再为每次飞行前反复询价、比价、议价而烦恼', '卡内飞行小时无使用有效期，只要有余额即有效']
            },{
                name: '更多元',
                value: ['10小时、25小时、50小时多卡种，满足不同需求', '一卡在手，多种机型随意选', '附赠多项免费权益（加急费、免费升机型、全球医疗救援服务）', '不仅可以包机，还可以坐游艇，一卡多服务', '续新卡还额外赠送飞行小时，多买多得']
            }],
            level: 5
        }, {
            name: '金鹿 小时卡',
            type: '悠游卡',
            description: '25小时专享按小时计费的公务机消费模式',
            money: 'RMB 1,958,888',
            official: '公务机，一种新的出行方式。不再迁就航班，不再忍受延误，用效率丈量金钱， 用金钱换取时间。',
            hour: '小时卡，一种更有价值的公务机体验。远离昂贵的购机，远离复杂的包机。用时间商定价格，用价格优化效率。',
            feature: [{
                name: '更划算',
                value: ['10小时即可起步，准入门槛低', '小时单价远低于市场价', '国际、国内调机单位小时价格一致']
            },{
                name: '更透明',
                value: ['仅以飞行时间结算，让客户一目了然', '不再为每次飞行前反复询价、比价、议价而烦恼', '卡内飞行小时无使用有效期，只要有余额即有效']
            },{
                name: '更多元',
                value: ['10小时、25小时、50小时多卡种，满足不同需求', '一卡在手，多种机型随意选', '附赠多项免费权益（加急费、免费升机型、全球医疗救援服务）', '不仅可以包机，还可以坐游艇，一卡多服务', '续新卡还额外赠送飞行小时，多买多得']
            }],
            level: 6
        }, {
            name: '金鹿 小时卡',
            type: '翱翔卡',
            description: '50小时专享按小时计费的公务机消费模式',
            money: 'RMB 3,868,888',
            official: '公务机，一种新的出行方式。不再迁就航班，不再忍受延误，用效率丈量金钱， 用金钱换取时间。',
            hour: '小时卡，一种更有价值的公务机体验。远离昂贵的购机，远离复杂的包机。用时间商定价格，用价格优化效率。',
            feature: [{
                name: '更划算',
                value: ['10小时即可起步，准入门槛低', '小时单价远低于市场价', '国际、国内调机单位小时价格一致']
            },{
                name: '更透明',
                value: ['仅以飞行时间结算，让客户一目了然', '不再为每次飞行前反复询价、比价、议价而烦恼', '卡内飞行小时无使用有效期，只要有余额即有效']
            },{
                name: '更多元',
                value: ['10小时、25小时、50小时多卡种，满足不同需求', '一卡在手，多种机型随意选', '附赠多项免费权益（加急费、免费升机型、全球医疗救援服务）', '不仅可以包机，还可以坐游艇，一卡多服务', '续新卡还额外赠送飞行小时，多买多得']
            }],
            level: 7
        }];

        $scope.dreamFlyList = [{
            id: '1',
            createTime: '1491541200000',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            guest: '16',
            aircraft: '00092842',
            machine: '77000',
            seat: '1300',
            least: { number: '3' }
        }, {
            id: '2',
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            guest: '16',
            aircraft: '00092842',
            machine: '666636',
            seat: '1300',
            least: { number: '3' }
        }, {
            id: '3',
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            guest: '16',
            aircraft: '00092842',
            machine: '77000',
            seat: '1300',
            least: { number: '3' }
        }, {
            id: '4',
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            guest: '16',
            aircraft: '00092842',
            machine: '44265',
            seat: '1300',
            least: { number: '3' }
        }, {
            id: '5',
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            guest: '16',
            aircraft: '00092842',
            machine: '34320000',
            seat: '2800',
            least: { number: '3' }
        }];

        $scope.recommendList = [{
            departure: '香港',
            destination: '三亚',
            money: '¥60万'
        }, {
            departure: '三亚',
            destination: '北京',
            money: '¥60万'
        }, {
            departure: '香港',
            destination: '北京',
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
                    }
                    
                });
                if(valid){
                    var formData = {
                        plan: data
                    };
                    if (status) {
                        mainView.router.loadPage('app/components/airjet/travel-info.html?jetdata=' + JSON.stringify(formData));
                    } else {
                        mainView.router.loadPage('app/components/airjet/travel-model.html?jetdata=' + JSON.stringify(formData));
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
            if(data){
                mainView.router.loadPage('app/components/airjet/tour-detail.html?tourdata=' + JSON.stringify(data))
            }
        };

        function datepicter(name, index) {
            var calendar = myApp.calendar({
                input: '.' + name + index,
                onDayClick: function () {
                    calendar.close();
                }
            });
        };
    }

})();