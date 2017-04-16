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
      var today = new Date();
      var queryData = myApp.views[0].activePage.query;
      $scope.jumpDetail = jumpDetail;
      $scope.city = queryData.city || '北京';
      angular.element('#citytour-title').text($scope.city + '观光');
      var pickerDevice = myApp.picker({
          input: '#citytour-title',
          cols: [
              {
                  textAlign: 'center',
                  values: ['北京', '桂林', '海南', '宁波'],
                  onChange: function(item, current){
                    angular.element('#citytour-title').text(current + '观光');
                  }
              }
          ]
      });

      var calendarDateFormat = myApp.calendar({
        input: '#tourcity-datepicker',
        dateFormat: 'yyyy年mm月dd日',
        disabled: {
          to: new Date().setDate(today.getDate() - 1)
        },
        onDayClick: function(item, ele, year, month, day) {
            var dateStr = '';
            if(year){
              dateStr += year + '-';
              dateStr += (month < 9) ? ('0' + (Number(month) + 1) + '-') : ((month + 1) + '-');
              dateStr += (day < 10) ? ('0' + Number(day)) : day;
            }
            $scope.dateStr = dateStr;
            calendarDateFormat.close();
        }
      });

      $scope.cityList = [{
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

      function jumpDetail(data){
        if(!$scope.dateStr) {
          NotificationService.alert.success('请选择出行日期', null);
          return;
        }
        mainView.router.loadPage('app/components/airtaxi/project-details.html?date=' + $scope.dateStr);
      };
    
    };
})();
