(function () {
  angular.module('airsc')
    .constant('REGEX', {
      PHONE: /(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}/, //Todo
      PASSWORD: /^[\\w@.$%#&*\\-]{8,20}$/, //Todo
      EMAIL: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, //Todo
      IDCARD: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
      NUMBER: /^[0-9]+$/
    })
})();