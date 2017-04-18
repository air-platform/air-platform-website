(function () {
    'use strict';

    angular.module('airsc').controller('modifyController', modifyController);

    /** @ngInject */
    function modifyController($scope, $rootScope, i18n, iotUtil, NetworkService, UrlService, URL) {
    	var queryData = myApp.views[0].activePage.query;

        var infoObj = {
            nickname: i18n.t('profile.nickname'),
            name: i18n.t('profile.username'),
            tel: i18n.t('profile.telNum'),
            email: i18n.t('profile.email')
        };

        $.each(queryData, function(index, item){
            $scope.headText = i18n.t('profile.modify') + infoObj[index];
            $scope.info = index;
            $('#modifyInfo').text($scope.headText);
        });

        $scope.saveBtn = function() {
            myApp.alert('修改成功', $scope.headText);
            mainView.router.back();
        }
    }
})();
