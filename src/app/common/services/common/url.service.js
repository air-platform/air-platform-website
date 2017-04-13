(function() {
  angular.module('airsc')
    .factory('UrlService', UrlService);
  /** @ngInject */
  function UrlService(URL) {
    var service = {
      getUrl: getUrl
    };

    return service;

    function getUrl(url) {
      return URL.BASE + url;
    }
  }
})();
