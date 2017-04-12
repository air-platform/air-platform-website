(function () {
  angular.module('airsc')
    .factory('HttpInterceptor', HttpInterceptor);

  function HttpInterceptor($q) {
    return {
      request: function (config) {
        // Todo to constant
        config.timeout = 2000;
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