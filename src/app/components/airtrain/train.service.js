/**
 * Created by Otherplayer on 2016/12/12.
 */

(function () {
    'use strict';


    /**
     *
     * facotry是一个单例,它返回一个包含service成员的对象。
     * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
     *
     */
    angular
        .module('airsc')
        .factory('TrainServer', TrainServer);

    /** @ngInject */
    function TrainServer(NetworkService,constdata) {

        var service = {
            getSchools: getSchools,
            getSchoolInfo: getSchoolInfo,
            getSchoolCourses: getSchoolCourses
        };

        return service;

        ////////////

        function getSchools(page,successHandler,failedHandler) {
            NetworkService.get('schools' + '?pageSize='+constdata.page.size+'&page=' + page,null,successHandler,failedHandler);
        }
        function getSchoolInfo(schoolId,successHandler,failedHandler) {
            NetworkService.get('schools/' + schoolId,null,successHandler,failedHandler);
        }
        function getSchoolCourses(schoolId,page,successHandler,failedHandler) {
            NetworkService.get('courses/school?id=' + schoolId + '&pageSize='+constdata.page.size + '&page=' + page,null,successHandler,failedHandler);
        }

    }



})();
