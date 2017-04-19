/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderaddController', orderaddController);

    /** @ngInject */
    function orderaddController($scope,OrderServer,constdata) {


        //订单信息
        /*
         capacity 在airtrans里面代表座位数、airtaxi里面代表景点数
         charterAll 包机
         charter 拼座
        */
        $scope.orderInfo = {
            flightId:'7f000001-5b76-17e6-815b-765f46c60002',flight:'首航直升机 B-7186',departure:'北京',arrival:'上海',capacity:5,date:'2017-5-1',time:'约12:36分钟',interval:'08:00-09:00',
            charterAll:{price:'$2000',capacity:5},charter:{price:'￥800',capacity:3},
            chartered:true
        };
        //乘客及联系人信息
        $scope.passengers = [];
        $scope.contactMobile = '';

        //获取信息
        var pageData = mainView.pageData;
        var pageType = pageData.from;
        if (pageType && pageType === 'airtrans'){//从air transportation过来
            pageData = pageData.schedules;
        }else{
            pageData = {};
        }

        // 获取 f7 页面
        // var page = myApp.views[myApp.views.length - 1];
        // var pageContainer = $$(page.container);
        // console.log(page);
        
        $scope.agreement = false;
        $scope.newPerson = {name:'',mobile:'',identity:''};
        $scope.isSelecteded = false;

        $scope.selectPassengerAction = selectPassengerAction;
        $scope.addNewPassengerAction = addNewPassengerAction;
        $scope.showPassengerAction = showPassengerAction;
        $scope.closeModalAction = closeModalAction;
        $scope.editContactPhoneAction = editContactPhoneAction;
        $scope.gotoAnnounceAction = gotoAnnounceAction;
        $scope.agreeValueChanged = agreeValueChanged;
        $scope.gotoOrderDetailAction = gotoOrderDetailAction;


        //获取乘客信息
        getPassengers();





        function selectPassengerAction(index) {
            $scope.passengers[index].isSelected = !$scope.passengers[index].isSelected;
        }
        function addNewPassengerAction() {
            myApp.showIndicator();
            if ($scope.newPerson.isUpdate){
                myApp.hideIndicator();
                closeModalAction();
            }else{
                OrderServer.addPassenger($scope.newPerson,function (res) {
                    $scope.passengers.push({name:$scope.newPerson.name,mobile:$scope.newPerson.mobile,identity:$scope.newPerson.identity});
                    closeModalAction();
                    myApp.hideIndicator();
                },function (err) {
                    myApp.hideIndicator();
                    showErrorAlert(err);
                });
            }
        }
        function showPassengerAction(index) {
            $scope.newPerson = $scope.passengers[index];
            $scope.newPerson.isUpdate = true;
            myApp.popup('.popup-passenger');
        }
        function closeModalAction() {
            myApp.closeModal('.popup-passenger');
            $scope.newPerson = {name:'',mobile:'',identity:'',isSelected:true};
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
        function gotoOrderDetailAction() {
            mainView.router.loadPage('app/components/order/orderdetail.html');
        }


        
        function gotoAnnounceAction() {
            $scope.agreement = false;
            mainView.router.loadPage(constdata.router.protocal.safe);
        }
        function agreeValueChanged() {
            $scope.agreement = !$scope.agreement;
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
