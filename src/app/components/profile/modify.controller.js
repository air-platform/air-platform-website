(function () {
    'use strict';

    angular.module('airsc').controller('modifyController', modifyController);

    /** @ngInject */
    function modifyController($scope, $rootScope, iotUtil, NetworkService, UrlService, URL) {
    	var queryData = myApp.views[0].activePage.query;

        var infoObj = {
            nickname: '昵称',
            name: '姓名',
            tel: '手机号',
            email: '邮箱'
        }

        $.each(queryData, function(index, item){
            var headText = '修改' + infoObj[index];
            $scope.info = index;
            $('#modifyInfo').text(headText);
        });

        $scope.saveBtn = function() {
            alert($rootScope.userInfo[$scope.info]);
            mainView.router.back();
        }
    }
})();
