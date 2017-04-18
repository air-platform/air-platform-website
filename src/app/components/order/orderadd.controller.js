/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderaddController', orderaddController);

    /** @ngInject */
    function orderaddController($scope,OrderServer,constdata) {




        //订单信息
        $scope.orderInfo = {planeInfo:{name:'首航直升机 B-7186',date:'2017-5-1'},from:'北京',to:'上海',seat:5,time:'约12:36分钟',interval:'08:00-09:00'};
        //乘客及联系人信息
        $scope.passengers = [];
        $scope.contactMobile = '';
        
        
        
        $scope.agreement = true;
        $scope.newPerson = {name:'',mobile:'',identity:''};
        $scope.isSelecteded = false;

        $scope.selectPassengerAction = selectPassengerAction;
        $scope.addNewPassengerAction = addNewPassengerAction;
        $scope.closeModalAction = closeModalAction;
        $scope.editContactPhoneAction = editContactPhoneAction;
        $scope.gotoAnnounceAction = gotoAnnounceAction;
        $scope.agreeValueChanged = agreeValueChanged;



        //获取乘客信息
        getPassengers();





        function selectPassengerAction(index) {
            $scope.passengers[index].isSelected = !$scope.passengers[index].isSelected;
        }
        function addNewPassengerAction() {
            myApp.showIndicator();
            OrderServer.addPassenger($scope.newPerson,function (res) {
                $scope.passengers.push({name:$scope.newPerson.name,mobile:$scope.newPerson.mobile,identity:$scope.newPerson.identity});
                $scope.newPerson = {name:'',mobile:'',identity:'',isSelected:true};
                closeModalAction();
                myApp.hideIndicator();
            },function (err) {
                myApp.hideIndicator();
                showErrorAlert(err);
            });
        }
        function closeModalAction() {
            myApp.closeModal('.popup-passenger');
        }
        function editContactPhoneAction() {
            myApp.prompt('','请输入联系人手机号', function (value) {
                if (value.length !== 11){
                    myApp.alert('手机号格式不正确！');
                }else{
                    $scope.contactMobile = value;
                    $scope.$apply();//需要手动刷新
                }
            });
        }



        
        function gotoAnnounceAction() {
            mainView.router.loadPage(constdata.router.protocal.safe);
        }
        function agreeValueChanged() {
            $scope.$apply();//需要手动刷新
            console.log($scope.agreement);
        }
        function getPassengers() {
            OrderServer.passengers(function (res) {
                $scope.passengers = res.data;
            },function (err) {
                console.log(err);
            });
        }

        function showErrorAlert(err) {
            var errDesc = err.statusText;
            myApp.alert(errDesc, 'Air Community');
        }

    }

})();
