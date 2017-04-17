/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('orderaddController', orderaddController);

    /** @ngInject */
    function orderaddController($scope,NetworkService,$interval,iotUtil) {


        $scope.newPerson = {name:'',id:'',phone:''};
        $scope.isSelecteded = true;

        $scope.addNewPersonAction = addNewPersonAction;
        $scope.closeModalAction = closeModalAction;
        $scope.deletePersonAction = deletePersonAction;
        $scope.editContactPhoneAction = editContactPhoneAction;

        function addNewPersonAction() {
            myApp.popup('.popup-about');
        }
        function deletePersonAction(index) {
            myApp.confirm('确认移除吗？', function () {

            },function () {

            });
        }
        function closeModalAction() {
            myApp.closeModal('.popup-about');
        }
        function editContactPhoneAction() {
            myApp.prompt('','请输入联系人手机号', function (value) {

                if (value.length !== 11){
                    myApp.alert('手机号格式不正确！');
                }else{
                    console.log(value);
                }

            });
        }

    }

})();
