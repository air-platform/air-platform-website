(function () {
  angular.module('airsc')
    .factory('HttpInterceptorService', HttpInterceptorService);

  function HttpInterceptorService($q, TIMEOUT, STATUS) {
    return {
      request: function (config) {
        config.timeout = TIMEOUT.HTTP;
        // myApp.showIndicator();
        return config;
      },
      responseError: function (res) {
        // myApp.hideIndicator();
        switch (res.status.code) {
          case STATUS.HTTP.UNAUTHORIZED :
            //Todo 未登录逻辑
            break;
        }
        return $q.reject(res);
      }
    }
  }
})();