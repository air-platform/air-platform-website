(function () {
  angular.module('airsc')
    .factory('HttpInterceptor', HttpInterceptor);

  function HttpInterceptor($q, TIMEOUT) {
    return {
      request: function (config) {
        config.timeout = TIMEOUT.HTTP;
        // myApp.showIndicator();
        console.log(config);
        return config;
      },
      responseError: function (res) {
        console.log(res);
        // myApp.hideIndicator();
        switch (res.status) {
          case 201 :
            console.log('未登录');
            break;
        }
        return $q.reject(res);
      }
    }
  }
})();