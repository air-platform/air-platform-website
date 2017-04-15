/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope, $window, iotUtil) {
        $scope.travelStrokeList = [{ departure: '请选择', destination: '请选择' }];
        $scope.reversal = reversal;
        $scope.quickSubmit = quickSubmit;
        $scope.slowSubmit = slowSubmit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.datepicter = datepicter;

        $scope.cardList = [{
            name: '金鹿 FBO',
            type_cn: '铂金卡',
            type_en: 'Platinum Card',
            money: 'RMB 1,000,000',
            level: 1
        },{
            name: '金鹿 FBO',
            type_cn: '钻石卡',
            type_en: 'Diamond Card',
            money: 'USD 1,000',
            level: 2
        },{
            name: '金鹿 FBO',
            type_cn: '尊享卡',
            type_en: 'Honor Card',
            money: 'RMB 5,00,000',
            level: 3
        },{
            name: '金鹿 FBO',
            type_cn: '精英卡',
            type_en: 'Elite Card',
            money: 'RMB 5,00,000',
            level: 4
        }];

        $scope.hourCardList = [{
            name: '金鹿 小时卡',
            type: '飞翔卡',
            description: '10小时专享按小时计费的公务机消费模式',
            money: 'RMB 788,888',
            level: 5
        },{
            name: '金鹿 小时卡',
            type: '悠游卡',
            description: '25小时专享按小时计费的公务机消费模式',
            money: 'RMB 1,958,888',
            level: 6
        },{
            name: '金鹿 小时卡',
            type: '翱翔卡',
            description: '50小时专享按小时计费的公务机消费模式',
            money: 'RMB 3,868,888',
            level: 7
        }];

        $scope.dreamFlyList = [{
            id:'1',
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
            least:{number: '3'}
        },{
            id:'2',
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
            least:{number: '3'}
        },{
            id:'3',
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
            least:{number: '3'}
        },{
            id:'4',
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
            least:{number: '3'}
        },{
            id:'5',
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
            least:{number: '3'}
        }];

        $scope.recommendList = [{
            departure: '香港',
            destination: '三亚',
            money: '¥60万'
        },{
            departure: '三亚',
            destination: '北京',
            money: '¥60万'
        },{
            departure: '香港',
            destination: '北京',
            money: '¥60万'
        }];

        $scope.cityList = [{
            name: '北京',
            value: 'beijing'
        },{
            name: '上海',
            value: 'shanghai'
        },{
            name: '杭州',
            value: 'hangzhou'
        }];

        function reversal(item, order) {
            var local = item.departure;
            $scope.travelStrokeList.map(function(opt, index){
                if(order === index){
                    opt.departure = opt.destination;
                    opt.destination = local;
                    return;
                }
            })
        };

        function quickSubmit(data) {
            console.log(data)
            console.log($scope.travelStrokeList)
            if($scope.travelStrokeList){
                mainView.router.loadPage('app/components/airjet/travel-info.html');
            }
        };

        function slowSubmit(data) {
            console.log(data)
            console.log($scope.travelStrokeList)
            if($scope.travelStrokeList){
                mainView.router.loadPage('app/components/airjet/travel-model.html');
            }
        };

        function addCard() {
            $scope.travelStrokeList.push({ departure: '请选择', destination: '请选择' });
        };

        function removeCard(index) {
            $scope.travelStrokeList.splice(index, 1);
        };

        function datepicter(name, index){
            var calendar = myApp.calendar({
                input: '.' + name + index,
                onDayClick: function() {
                    calendar.close();
                }
            });    
        };
    }

})();