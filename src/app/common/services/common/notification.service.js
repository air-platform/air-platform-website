(function() {
  angular.module('airsc')
    .factory('NotificationService', NotificationService);
  /** @ngInject */
  function NotificationService() {
    var service = {
      alert: new Alert()
    };

    return service;

    function Alert() {
      this.success = myApp.alert;
      //Todo maybe other alert style
      this.error = myApp.alert;
    }
  }
})();
