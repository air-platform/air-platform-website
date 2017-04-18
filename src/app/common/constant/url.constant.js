(function () {
  angular.module('airsc')
    .constant('URL', {
      BASE: '',
      LOGIN: 'account/auth',
      PROFILE:'account/profile',
      COURSE: 'courses',
      USERPASSENGERS: 'user/passengers',
      USEREMAIL: 'account/email'
    })
})();