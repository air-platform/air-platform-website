/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('dreamInnerController', dreamInnerController);

    /** @ngInject */
    function dreamInnerController($scope, NotificationService) {
        var queryData = myApp.views[0].activePage.query;
        $scope.formData = {};
        $scope.submit = submit;
        $scope.imgSrc = [
            './../assets/images/hotair.png',
            './../assets/images/hotair.png',
            './../assets/images/hotair.png'
        ];

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
            name: '北京首都',
            value: 'beijing'
        },{
            name: '三亚凤凰',
            value: 'sanya'
        }];
        

        if(queryData.id){
            $scope.dreamFlyList.forEach(function(item){
                if(item.id === queryData.id){
                    $scope.dreamObj = item;
                    return;
                }
            })
        }

        function submit(data) {
            if(!data.name){
                NotificationService.alert.success('请填写姓名', null);
                return;
            }
            if(!data.phone){
                NotificationService.alert.success('请填写电话', null);
                return;
            }
            if(!data.email){
                NotificationService.alert.success('请填写邮箱', null);
                return;
            }
            if(!data.guest){
                NotificationService.alert.success('请填写客户名称', null);
                return;
            }
            mainView.router.loadPage('app/components/airjet/dream-detail.html?dreamdata=' + JSON.stringify(data));
        };
    }

})();