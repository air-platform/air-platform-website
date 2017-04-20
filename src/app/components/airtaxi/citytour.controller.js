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
    function citytourController($scope, NotificationService) {
      var citys = ['北京', '桂林', '海南', '宁波'];
      var today = new Date();

      var init = function() {
        var queryData = mainView.query;
        $scope.jumpDetail = jumpDetail;
        $scope.city = queryData.city || citys[0];
        angular.element('#citytour-title').text($scope.city + '观光');
        $scope.tourdate = convertDate(today);
        $scope.sitesList = [{
          pic: 'assets/images/city.png',
          title: '八达岭长城观光',
          info: '近距离低空俯览八达岭长城'
        },{
          pic: 'assets/images/city.png',
          title: '八达岭长城观光',
          info: '近距离低空俯览八达岭长城'
        },{
          pic: 'assets/images/city.png',
          title: '八达岭长城观光',
          info: '近距离低空俯览八达岭长城'
        }];
      }

      var pickerDevice = myApp.picker({
          input: '#citytour-title',
          cols: [
              {
                  textAlign: 'center',
                  values: citys,
                  onChange: function(item, current){
                    angular.element('#citytour-title').text(current + '观光');
                    $scope.city = current;
                  }
              }
          ]
      });

      var calendarDateFormat = myApp.calendar({
        input: '#tourcity-datepicker',
        dateFormat: 'yyyy-mm-dd',
        disabled: {
          to: new Date().setDate(today.getDate() - 1)
        },
        onDayClick: function(item, ele, year, month, day) {
            $scope.tourdate = convertDate(new Date(year, month, day));
            calendarDateFormat.close();
        }
      });

      var convertDate = function(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var mmChars = mm.split('');
        var ddChars = dd.split('');

        return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
      }

      function jumpDetail(data){
        if(!$scope.tourdate) {
          NotificationService.alert.success('请选择出行日期', null);
          return;
        }
        mainView.router.loadPage('app/components/airtaxi/project-details.html?date=' + $scope.tourdate);
      };
      init();
    };
})();
