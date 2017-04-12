(function () {
  angular.module('airsc')
    .factory('ValidatorService', ValidatorService);

  function ValidatorService() {
    var service = {
      validate: new Validator()
    };

    return service;

    function Validator() {
      
    }

    Validator.prototype.email = function () {
      //Todo
      // this.email
      // useage xxx.email.bind('email')
      return true;
    }

    Validator.prototype.password = function () {
      //Todo
      return true;
    }

    Validator.prototype.phone = function () {
      //Todo
      return true;
    }
  }
})();