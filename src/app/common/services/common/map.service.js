(function() {
  angular.module('airsc')
    .factory('MapService', MapService);
  /** @ngInject */
  function MapService() {
    function mapPromise() {
      return new Promise(function (resolve, reject) {
        loadScript('http://api.map.baidu.com/api?v=2.0&ak=uZ6QZYpe6GUT2wTjBvLrEDx8wlZaMOmu&callback=mapCallback').then(function (res) {
          return loadScript('http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js');
        }).then(function () {
          window.mapCallback = function () {
            resolve(BMap);
          };
        });
      });
    }

    return {
      mapPromise: mapPromise
    }
  }
})();
