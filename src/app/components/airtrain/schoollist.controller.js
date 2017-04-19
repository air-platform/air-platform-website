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

        TrainServer.getSchools(1,function (res) {
            console.log(res.data.content);
        },function (err) {
            console.log(err);
        });


        $scope.items = [
            {imgUrl:'http://lorempixel.com/1000/600/nature/3/',title:'海南航空学校有限责任公司'},
            {imgUrl:'http://lorempixel.com/1000/600/nature/3/',title:'海南航空学校有限责任公司'},
            {imgUrl:'http://lorempixel.com/1000/600/nature/3/',title:'海南航空学校有限责任公司'}];

    }

})();