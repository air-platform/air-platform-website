/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('jetController', jetController);

    /** @ngInject */
    function jetController($scope, $window, iotUtil) {
        var page = myApp.views[0];
        var formData = page.activePage.query;
        $scope.submit = submit;
        $scope.addCard = addCard;
        $scope.removeCard = removeCard;
        $scope.datepicter = datepicter;

        $scope.imgSrc = [
            './../assets/images/banner0.jpg',
            './../assets/images/banner1.jpg',
            './../assets/images/banner0.jpg'
        ];

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
        

        if(formData.id){
            $scope.dreamFlyList.forEach(function(item){
                if(item.id === formData.id){
                    $scope.dreamObj = item;
                    return;
                }
            })
        }

        function submit(formData) {
            myApp.addView('.view-main').router.loadPage('app/components/airjet/dream-detail.html')
        };

        function addCard() {
            if(!$scope.travelPlanList || !$scope.travelPlanList.length) {
                $scope.travelPlanList = [1];
            } else  {
                for(var i = 1; i < 100; i++) {
                    if($scope.travelPlanList.indexOf(i) === -1) {
                        $scope.travelPlanList.push(i);
                        return;
                    }
                }
            }
        };

        function removeCard(item) {
            $scope.travelPlanList.splice($scope.travelPlanList.indexOf(item), 1)
        };

        function datepicter(name, index){
            var calendar = myApp.calendar({
                input: '.' + name + index,
                onDayClick: function() {
                    calendar.close();
                }
            });    
        }
    }

})();