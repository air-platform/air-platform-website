/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('settingController', settingController);

    /** @ngInject */
    function settingController($scope, $rootScope, iotUtil, i18n) {


        $scope.gotoDetail = gotoDetail;

        function gotoDetail() {
            mainView.router.loadPage('app/components/setting/password.html');
        }




        /** -评论- **/
        $scope.loading = false;
        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {
            if ($scope.loading)return;
            $scope.loading = true;
            console.log('----');
        });
        /** -end- **/


    }

})();
