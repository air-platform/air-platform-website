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
    function schoolController($scope,TrainServer) {


        var schoolId = myApp.views[0].activePage.query.schoolId;



        $scope.backAction = function () {
            mainView.router.back();
        }

        $scope.school = {};
        $scope.items = [{imgUrl:'http://lorempixel.com/1000/600/nature/3/',content:'海南航空学校有限责任公司（简称“海航航校”）是由世界500强海航集团有限公司与北京东永投资有限公司、香港MASTER茂隆国际公司、法国ESMA航空学院于2009年联合投资创办的专业航空培训机构，于2010年4月通过民航中南地区管理局运行合格审定，正式投入运行，由海航集团全权经营管理。海航航校严格按照CCAR-141部运行，以航空器驾驶员培训为主营业务，开设固定翼私用驾驶员执照培训、商用驾驶员执照培训、仪表等级培训和飞行教员执照培训、直升机私用驾驶员执照培训和商用驾驶员执照培训、高性能培训、航线运输驾驶员执照培训(ATPL)、执照换照培训等。\n  海航航校注册地为海南三亚，总部设在湖北宜昌，拥有湖北宜昌、宁夏中卫、甘肃庆阳、湖北恩施4个固定翼基地、北京平谷直升机基地以及海航飞翔航空俱乐部。此外海南博鳌英语基地也正在筹备之中。各基地均配备了办公楼、宿舍楼、食堂、飞行讲评室、CBT教室、飞行保障中心、外场讲评室、飞行员休息室、机务保障中心、模拟机训练中心等完善的教学生活设施，能为学员提供优越的理论学习、飞行训练和日常生活保障。'},
            {imgUrl:'http://lorempixel.com/1000/600/nature/3/',contents:[{title:'宜昌基地',content:'海航航校宜昌基地位于全国著名的旅游城市、世界水电之都，中国电力心脏的湖北省宜昌市，“上控巴蜀，下引荆襄”，空铁水路交通汇集，历史文化悠久。海航航校宜昌基地坐落于宜昌三峡机场，于2010年4月正式投入运行。宜昌基地环境清新优美，配套设施齐备，飞行训练环境优越。机队规模为17架，包括15架DA系列飞机、2架高性能飞机，并配备DA训练器2台。'},{title:'宜昌基地',content:'海航航校宜昌基地位于全国著名的旅游城市、世界水电之都，中国电力心脏的湖北省宜昌市，“上控巴蜀，下引荆襄”，空铁水路交通汇集，历史文化悠久。海航航校宜昌基地坐落于宜昌三峡机场，于2010年4月正式投入运行。宜昌基地环境清新优美，配套设施齐备，飞行训练环境优越。机队规模为17架，包括15架DA系列飞机、2架高性能飞机，并配备DA训练器2台。'}]}];


        function getData() {
            TrainServer.getSchoolInfo(schoolId,function (res) {
                var data = res.data;
                $scope.school = data;
                console.log(data);//description baseDesc address image name
                $scope.items = $scope.items.concat(data);
            },function (err) {
                console.log(err);
            });
        }

        getData();

    }

})();