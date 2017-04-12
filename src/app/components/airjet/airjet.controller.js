/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope,iotUtil) {
        var airjetVm = this;

        airjetVm.dreamFlyList = [{
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            aircraft: '00092842',
            machine: '77000',
            seat: '1300',
            least:{number: '3'}
        },{
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            aircraft: '00092842',
            machine: '666636',
            seat: '1300',
            least:{number: '3'}
        },{
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            aircraft: '00092842',
            machine: '77000',
            seat: '1300',
            least:{number: '3'}
        },{
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            aircraft: '00092842',
            machine: '44265',
            seat: '1300',
            least:{number: '3'}
        },{
            createTime: '2017年04月07日 周六',
            startTime: '13:00',
            endTime: '16:30',
            departure: '香港',
            destination: '北京',
            model: 'G650',
            aircraft: '00092842',
            machine: '1347236',
            seat: '1300',
            least:{number: '3'}
        }];

    }

})();