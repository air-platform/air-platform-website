/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderaddController', orderaddController);

    /** @ngInject */
    function orderaddController($scope,OrderServer,constdata,StorageService) {


        //订单信息
        /*
         capacity 在airtrans里面代表座位数、airtaxi里面代表景点数
         charterAll 包机
         charter 拼座
        */

        var mobile = '';
        var information = StorageService.get(constdata.information);
        var airtransType = StorageService.get(constdata.cookie.airtrans.type);
        var airtransData = StorageService.get(constdata.cookie.airtrans.data);
        if (information){
            $scope.infoData = {name:information.realName,phone:information.mobile,email:information.email};
            mobile = information.mobile;
        }

        $scope.orderInfo = {
            flightId:'',flight:'',departure:'',arrival:'',capacity:0,date:'',time:'',interval:'',
            charterAll:{price:0,capacity:0},charter:{price:0,capacity:0},
            contactMobile:mobile,
            chartered:true
        };
        //乘客及联系人信息
        $scope.passengers = [];
        $scope.psgs = [];
        $scope.istour = false;

        // 从上个页面获取信息
        var pageData = mainView.pageData;
        console.log(pageData);

        if (!pageData || pageData === 'undefined'){
            pageData = StorageService.get('temporderadddata');
        }else{
            StorageService.put('temporderadddata',pageData, 10 * 60);
        }

        var pageType = pageData.type;

        if (pageType && (pageType === 'transportation' || pageType === 'airtaxi')){//从air transportation过来
            $scope.istour = false;
            var planeModel = pageData.planeModel;
            var schedules = pageData.schedules;
            var route = pageData.route;
            $scope.orderInfo.flightId = planeModel.product;
            $scope.orderInfo.aircraftItemId = planeModel.id;
            $scope.orderInfo.flight = planeModel.aircraft.name;
            $scope.orderInfo.charter.capacity = planeModel.minPassengers;
            $scope.orderInfo.charter.price = planeModel.seatPrice;
            $scope.orderInfo.charterAll.price = planeModel.price;
            $scope.orderInfo.charterAll.capacity = planeModel.aircraft.seats;
            $scope.orderInfo.capacity = planeModel.aircraft.seats;

            $scope.orderInfo.departure = schedules.departure;
            $scope.orderInfo.arrival = schedules.arrival;
            $scope.orderInfo.interval = schedules.time;
            var date = schedules.date.replace('年','-');
            date = date.replace('月','-');
            date = date.replace('日','');
            $scope.orderInfo.date = date;
            $scope.orderInfo.icon = planeModel.aircraft.vendor.avatar;
            $scope.orderInfo.aircraftType = planeModel.aircraft.category;
            $scope.orderInfo.time = route.timeEstimation;
            $scope.orderInfo.minPassengers = planeModel.aircraft.minPassengers;

        }else {
            $scope.istour = true;
            var model = pageData.planeModel;
            var site = pageData.site;
            var tourPoints = site.tourPoint.split(';');
            $scope.orderInfo.flightId = site.aircraftItems[0].product;
            $scope.orderInfo.aircraftItemId = site.aircraftItems[0].id;
            $scope.orderInfo.flight = site.aircraftItems[0].aircraft.name;
            $scope.orderInfo.charter.capacity = site.aircraftItems[0].aircraft.minPassengers;
            $scope.orderInfo.charter.price = site.aircraftItems[0].seatPrice;
            $scope.orderInfo.charterAll.price = site.aircraftItems[0].price;
            // $scope.orderInfo.charterAll.capacity = planeModel.aircraft.seats;
            $scope.orderInfo.capacity = tourPoints.length + '景点';//tourPoint
            // $scope.orderInfo.flight = site.name;
            $scope.orderInfo.interval = site.tourTime + '分钟';
            $scope.orderInfo.time = site.tourDistance + '公里';
            $scope.orderInfo.date = pageData.tourdate;
            $scope.orderInfo.departure = site.name;
            $scope.orderInfo.icon = site.vendor.avatar;
            $scope.orderInfo.aircraftType = model.aircraft.category;
            $scope.orderInfo.minPassengers = model.aircraft.minPassengers;
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
            if (!$scope.passengers[index].isSelected && $scope.psgs.length >= $scope.orderInfo.capacity){
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


            //判断手机号、id、姓名

            if (!$scope.newPerson.name || $scope.newPerson.name.length === 0){
                myApp.alert('请输入姓名');
                return;
            }else if (!$scope.newPerson.identity || $scope.newPerson.identity.length !== 18){
                myApp.alert('身份证号不正确');
                return;
            }else if (!$scope.newPerson.mobile || $scope.newPerson.mobile.length !== 11){
                myApp.alert('手机号码不正确');
                return;
            }
            var isSamePeople = false;
            for (var i = 0; i < $scope.passengers.length; i++){
                var ps = $scope.passengers[i];
                if (ps.identity === $scope.newPerson.identity){
                    isSamePeople = true;
                    break;
                }
            }
            if (isSamePeople){
                myApp.alert('此身份证号已经添加过了');
                return;
            }

            myApp.showIndicator();
            if ($scope.newPerson.isUpdate){
                myApp.hideIndicator();
                closeModalAction();
            }else{
                OrderServer.addPassenger($scope.newPerson,function (res) {
                    $scope.passengers.push({name:$scope.newPerson.name,mobile:$scope.newPerson.mobile,identity:$scope.newPerson.identity,id:res.data.id});
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
                    $scope.psgs.push({passenger:p.id});
                }
            });

            if(angular.isUndefined($scope.orderInfo.contactMobile)){
                showAlert('请填写联系人手机');
                return;
            }

            if ($scope.orderInfo.contactMobile.length !== 11){
                editContactPhoneAction();
                return;
            }else if ($scope.psgs.length === 0){
                showAlert('请选择乘机人');
                return;
            }

            var param = {
                airTransport:$scope.orderInfo.flightId,
                airTaxi:$scope.orderInfo.flightId,
                airTour:$scope.orderInfo.flightId,
                chartered: $scope.orderInfo.chartered,
                date: $scope.orderInfo.date,
                timeSlot: $scope.orderInfo.interval,
                passengers: $scope.psgs,
                contact:{mobile:$scope.orderInfo.contactMobile},
                aircraftItem:$scope.orderInfo.aircraftItemId
            };

            OrderServer.submitOrder(param,pageType,function (res) {
                // console.log(res);
                var local = res.headers('location').split('/');
                var nOrderId = local[local.length - 1];
                if (pageType){
                    if(pageType === 'airtaxi') {
                        StorageService.clear(constdata.cookie.airtaxi.data);
                    }
                    if(pageType === 'transportation') {
                        if(airtransType){
                            if(airtransType === '飞越海峡') {
                                airtransData[0] = null;
                            } else {
                                airtransData[1] = null;
                            }
                            StorageService.put(constdata.cookie.airtrans.data, airtransData);
                        }
                    }
                }
                mainView.router.loadPage('app/components/order/ordersuc.html?type='+ pageType +'&orderId=' + nOrderId);
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
            // $scope.agreement = false;
            if (1 === type){
                mainView.router.loadPage(constdata.router.protocal.announce);
            }else{
                if ($scope.orderInfo.aircraftType && $scope.orderInfo.aircraftType === '直升机'){
                    mainView.router.loadPage(constdata.router.protocal.safehelicopter);
                }else{
                    mainView.router.loadPage(constdata.router.protocal.safefixedwing);
                }
            }
        }
        function agreeValueChanged() {
            $scope.agreement = !$scope.agreement;
        }
        function getPassengers() {
            OrderServer.passengers(function (res) {
                $scope.passengers = res.data;
                console.log(res.data);
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
