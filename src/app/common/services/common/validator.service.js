(function () {
  angular.module('airsc')
    .factory('ValidatorService', ValidatorService);

  function ValidatorService(REGEX) {


    var validate = {
      password: '',
      phone: '',
      email: '',
      hasParams: hasParams,
      checkEmail: checkEmail,
      checkPassword: checkPassword,
      checkPhone: checkPhone,
    };

    function hasParams (params) {
      return params.length > 0;
    }

    function checkEmail () {
      //Todo
      return true;
    }

    function checkPassword () {
      if (validate.hasParams(arguments)) {
        validate.password = arguments[0];
      }

      return REGEX.PASSWORD.test(validate.password);
    }

    function checkPhone () {
      //Todo
      return REGEX.PHONE.test(validate.phone);
    }

    var service = {
      validate: validate
    };

    return service;
  }
})();