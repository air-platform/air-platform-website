(function () {
  angular.module('airsc')
    .constant('URL', {
      BASE: '',
      LOGIN: 'account/auth',
      PROFILE:'account/profile',
      COURSE: 'courses',
      HOTCOURSE: 'courses/hot',
      USERPASSENGERS: 'user/passengers',
      USEREMAIL: 'account/email',
      TOPICS: 'topics',
      AIRJET_TYPE: 'airjets',
      AIRJET_PLANE: 'fleets',
      AIRJET_ORDER: 'user/chater/orders',
      AIRJET_CARD_ORDER: 'user/jetcard/orders',
      AIRJET_CARD: 'jetcards',
      AIRJET_RECOMMENDED: 'ferryflights?recommended=true',
      AIRJET_DREAM: 'ferryflights',
      AIRJET_DREAM_ORDER: 'user/ferryflight/orders'
    })
})();