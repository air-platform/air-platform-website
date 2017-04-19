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
    function schoollistController($scope,TrainServer) {


        $scope.items = [];
        $scope.gotoSchoolInfo = gotoSchoolInfo;


        function gotoSchoolInfo(index) {
            mainView.router.loadPage('app/components/airtrain/school.html');
        }


        function getDatas(page) {
            TrainServer.getSchools(page,function (res) {
                var data = res.data.content;
                console.log(data);
                $scope.items = $scope.items.concat(data);
            },function (err) {
                console.log(err);
            });
        }

        getDatas(1);

    }

})();