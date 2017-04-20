(function() {
  angular.module('airsc')
    .factory('HttpInterceptorService', HttpInterceptorService);
  /** @ngInject */
  function HttpInterceptorService($q, TIMEOUT, STATUS) {
    return {
      request: function(config) {
        config.timeout = TIMEOUT.HTTP;
        // myApp.showIndicator();
        return config;
      },
      responseError: function(res) {
        console.log(res)
        // myApp.hideIndicator();
        switch (res.status.code) {
          case STATUS.HTTP.UNAUTHORIZED:
            //Todo 未登录逻辑
            break;
        }
        return $q.reject(res);
      }
    }
  }
})();
