/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('citytourController', citytourController);

    /** @ngInject */
    function citytourController($scope,iotUtil) {
      var ctl = this;
      var today = new Date();

      var calendarDateFormat = myApp.calendar({
        input: '#tourcity-datepicker',
        dateFormat: 'yyyy年m月d日',
        disabled: {
          to: new Date().setDate(today.getDate() - 1)
        }
      });

    }

})();
