(function () {
  angular.module('airsc')
    .constant('REGEX', {
      PHONE: /(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}/, //Todo
      PASSWORD: /\d+/, //Todo
      EMAIL: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, //Todo
    })
})();