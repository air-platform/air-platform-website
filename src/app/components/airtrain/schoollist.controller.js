/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('schoollistController', schoollistController);

    /** @ngInject */
    function schoollistController($scope,TrainServer,NotificationService) {


        $scope.items = [];
        $scope.gotoSchoolInfo = gotoSchoolInfo;


        function gotoSchoolInfo(index) {
            var item = $scope.items[index];
            mainView.router.loadPage('app/components/airtrain/school.html?schoolId=' + item.id);
        }


        function getDatas(page) {
            TrainServer.getSchools(page,function (res) {
                var data = res.data.content;
                $scope.items = $scope.items.concat(data);
            },function (err) {
                showErrorAlert(err);
            });
        }

        function showErrorAlert(err) {
            var errDesc = err.statusText;
            NotificationService.alert.error('获取数据失败！' + errDesc, null);
        }

        getDatas(1);

    }

})();