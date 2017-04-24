/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('schoolController', schoolController);

    /** @ngInject */
    function schoolController($scope,TrainServer,NotificationService,StorageService) {


        var schoolId = myApp.views[0].activePage.query.schoolId;

        if (schoolId && schoolId !== 'undefined'){
            StorageService.put('tempschoolid',schoolId,24 * 3 * 60 * 60);//3 天过期
        }else{
            schoolId = StorageService.get('tempschoolid');
        }


        $scope.backAction = function () {
            mainView.router.back();
        }

        $scope.school = {};
        $scope.courses = [];

        function getData() {
            TrainServer.getSchoolInfo(schoolId,function (res) {
                var data = res.data;
                $scope.school = data;
            },function (err) {
                showErrorAlert(err);
            });
        }
        function getSchoolCourses() {
            TrainServer.getSchoolCourses(schoolId,1,function (res) {
                var data = res.data.content;
                $scope.courses = $scope.courses.concat(data);
                console.log(data);//description baseDesc address image name
            },function (err) {
                showErrorAlert(err);
            });
        }

        function showErrorAlert(err) {
            var errDesc = err.statusText;
            NotificationService.alert.error('获取数据失败！' + errDesc, null);
        }

        getData();
        getSchoolCourses();

    }

})();