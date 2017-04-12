(function () {
  angular.module('airsc')
    .constant('STATUS', {
      HTTP: {
        SUCCESS: 200,
        UNAUTHORIZED: 201,
        SERVER_ERROR: 500,
        NOT_FOUND: 404,
      }
    })
})();