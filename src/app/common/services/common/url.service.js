(function () {
  angular.module('airsc')
    .factory('UrlService', UrlService);

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