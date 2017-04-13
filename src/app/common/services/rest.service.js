 (function () {
    'use strict';

     /** RestService */
    angular
        .module('airsc')
        .factory('RestService', RestService);

    // REST service based on Restangular  that uses setFullResponse
    /** @ngInject */
    function RestService(Restangular, StorageService,logger,constdata) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            var token = StorageService.get(constdata.token);
            if (token){
                logger.debug(token);
                token = 'Bearer ' + token;
                RestangularConfigurer.setDefaultHeaders({Authorization:token});
            }else{
                RestangularConfigurer.setDefaultHeaders({Authorization:null});
            }
            RestangularConfigurer.setFullResponse(true);
        });
    }

    /** NetworkService */
    angular
        .module('airsc')
        .factory('NetworkService', NetworkService);

    /** @ngInject */
    function NetworkService(RestService,StorageService,logger,constdata) {


        var service = {
            post  : post,
            get   : get,
            put   : put,
            delete: del
        };

        return service;

        /////////////////

        function post(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customPOST(param,"","",requestHeader()).then(
                successHandler,function (response) {
                    failedResponse(response,failedHandler,path);
                }
            );
        }

        function get(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customGET("",param,requestHeader()).then(successHandler,function (response) {
                failedResponse(response,failedHandler,path);
            });
        }
        
        function put(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customPUT(param,"",param,requestHeader()).then(successHandler,function (response) {
                failedResponse(response,failedHandler,path);
            });
        }
        function del(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customDELETE("","",requestHeader()).then(successHandler,function (response) {
                console.log('delete failed');
                failedResponse(response,failedHandler,path);
            });
        }

        function failedResponse(response,failedHandler,path) {

            logger.info('-------' + path + '---------');
            logger.error(response);


            var newResponse = {};
            newResponse.status = response.status;
            if (response.data && response.data.message){
                newResponse.statusText = response.data.message;
            }else{
                newResponse.statusText = '服务器连接错误';
            }

            if (failedHandler){
                failedHandler(newResponse);
            }
        }

        function requestHeader() {
            var token = StorageService.get(constdata.token);
            if (token && token.length > 0){
                token = 'Bearer ' + token;
                return {"Authorization":token};
            }
            return {};
        }

    }


    /** StorageService */
    angular
        .module('airsc')
        .service('StorageService', StorageService);

    /** @ngInject */
    function StorageService() {

        this.put=function (key,value,exp) {
            if(window.localStorage){
                var curtime = new Date().getTime();//获取当前时间
                if(!exp){
                    exp = 0;
                }
                localStorage.setItem(key,JSON.stringify({val:value,time:curtime,exp:exp}));//转换成json字符串序列
            }else{
                console.log('This browser does NOT support localStorage');
            }
        };
        this.get=function (key) {
            if(window.localStorage){
                var val = localStorage.getItem(key);
                if (!val) return null;
                var dataobj = JSON.parse(val);

                if (!dataobj) return null;

                if((dataobj.exp !== 0) && (new Date().getTime() - dataobj.time > dataobj.exp * 1000)) {
                    console.log("expires");//过期
                    return null;
                }
                else{
                    //console.log("val="+dataobj.val);
                    return dataobj.val;
                }

            }else{
                console.log('This browser does NOT support localStorage');
                return null;
            }
        };

        this.clear = function (key) {
            localStorage.removeItem(key);
        };

        this.remove = function (key) {
            localStorage.removeItem(key);
        };

        this.item = function (key,value) {
            if (value){
                this.put(key,value,60 * 60);
            }
            var val = this.getItem(key);
            return val;
        };
        this.getItem = function (key) {
            var val = this.get(key);
            return val;
        };

    }

})();
