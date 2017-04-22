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
            flightId:'',flight:'',departure:'',arrival:'',capacity:0,date:'',time:'约12:36分钟',interval:'08:00-09:00',
            charterAll:{price:0,capacity:0},charter:{price:0,capacity:0},
            contactMobile:'',
            chartered:true
        };
        //乘客及联系人信息
        $scope.passengers = [];
        $scope.psgs = [];

        // 从上个页面获取信息
        var pageData = mainView.pageData;
        var pageType = pageData.from;
        console.log(pageData);
        if (pageType && pageType === 'airtrans'){//从air transportation过来
            var planeModel = pageData.planeModel;
            var schedules = pageData.schedules;
            $scope.orderInfo.flightId = planeModel.id;
            $scope.orderInfo.flight = planeModel.name + ' ' + planeModel.flightNo;
            $scope.orderInfo.charter.capacity = planeModel.minPassengers;
            $scope.orderInfo.charter.price = planeModel.seatPrice;
            $scope.orderInfo.charterAll.price = planeModel.price;
            $scope.orderInfo.charterAll.capacity = planeModel.seats;
            $scope.orderInfo.capacity = planeModel.seats;

            $scope.orderInfo.departure = schedules.departure;
            $scope.orderInfo.arrival = schedules.arrival;
            $scope.orderInfo.interval = schedules.time;
            $scope.orderInfo.date = schedules.date;

            console.log(pageData);
        }else{
            console.log(pageData);
        }

        // 获取 f7 页面
        // var page = myApp.views[myApp.views.length - 1];
        // var pageContainer = $$(page.container);
        // console.log(pageData);
        
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
        $scope.submitOrderAction = submitOrderAction;


        //获取乘客信息
        getPassengers();



        function selectPassengerAction(index) {
            if ($scope.psgs.length >= $scope.orderInfo.capacity){
                myApp.alert('本次航班只能乘坐' + $scope.orderInfo.capacity + '人');
                return;
            }
            $scope.passengers[index].isSelected = !$scope.passengers[index].isSelected;

            $scope.psgs = [];
            $scope.passengers.forEach(function (p) {
                if (p.isSelected){
                    $scope.psgs.push(p.identity);
                }
            });
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
                    $scope.orderInfo.contactMobile = value;
                    $scope.$apply();//需要手动刷新
                }
            });
        }
        function submitOrderAction() {
            //检查联系人手机号
            //检查是否有乘机人
            $scope.psgs = [];
            $scope.passengers.forEach(function (p) {
                if (p.isSelected){
                    $scope.psgs.push(p.identity);
                }
            });

            if ($scope.orderInfo.contactMobile.length !== 11){
                editContactPhoneAction();
                return;
            }else if ($scope.psgs.length === 0){
                showAlert('请选择乘机人');
                return;
            }

            var param = {
                airTransport:$scope.orderInfo.flightId,
                chartered: $scope.orderInfo.chartered,
                date: $scope.orderInfo.date,
                timeSlot: $scope.orderInfo.interval,
                passengers: $scope.psgs,
                contact:{mobile:$scope.orderInfo.contactMobile}
            };
            OrderServer.submitOrder(param,function (res) {
                console.log(res);
            },function (err) {
                showErrorAlert(err);
            });


            // mainView.router.loadPage('app/components/order/orderdetail.html');
            // mainView.pageData = {
            //     from:'orderadd',
            //     info:$scope.orderInfo,
            //     passengers:$scope.psgs
            // };
        }



        function gotoAnnounceAction(type) {
            $scope.agreement = false;
            if (1 === type){
                mainView.router.loadPage(constdata.router.protocal.announce);
            }else{
                mainView.router.loadPage(constdata.router.protocal.safehelicopter);
            }
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
            showAlert(errDesc);
        }
        function showAlert(msg) {
            myApp.alert(msg);
        }

    }

})();
