/**
 * Created by Otherplayer on 2017/4/10.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('planesController', planesController);

    /** @ngInject */
    function planesController($scope, iotUtil, NetworkService) {
        var controller = this;
        controller.planes = [];
        controller.planeSelected = {};

        // TODO: variable cannot be accessed if refresh on this page
        var transScope = angular.element($('[data-page=airtrans]')).scope();

        controller.planes = [
          {
            'name': '首航直升机B-7186',
            'imageUrl': 'assets/images/b-7186.png',
            'rentFee': 5000,
            'ticketFee': 1000,
            'delay': '15min',
            'seats': 5,
            'minPassengers': 3
          },
          {
            'name': '首航直升机B-7438',
            'imageUrl': 'assets/images/b-7438.png',
            'rentFee': 5000,
            'ticketFee': 1000,
            'delay': '15min',
            'seats': 5,
            'minPassengers': 3
          },
          {
            'name': '首航直升机B-7441',
            'imageUrl': 'assets/images/b-7441.png',
            'rentFee': 5000,
            'ticketFee': 1000,
            'delay': '15min',
            'seats': 5,
            'minPassengers': 3
          }
        ];

        controller.select = function(plane, $event) {
          $event.stopPropagation();
          $event.preventDefault();
          controller.planeSelected = plane;
          setTimeout(
            function(){
              $($event.target).closest('li').find('label.label-checkbox input').prop("checked", true);
              transScope.schedules[0].flight = plane.name;
            },
          0);
        };

        controller.init = function() {
          var planeModel = transScope.schedules[0].flight;
          controller.planeSelected = _.find(controller.planes, function(plane) {
            return plane.name == planeModel;
          });
          $.each($("#planes-selection").find("li"), function(i, el) {
            if($(el).find(".plane-name").text() == planeModel) {
              $(el).trigger('click');
            }
          });
        };

        //// wait for backend
        // NetworkService.get("url", {}, function(res) {
        //   controller.planes = res;
        // }, null);

        $scope.$watch('controller.planes', function(oldValue, newValue) {
            if (newValue != oldValue) {
              // retrieve available planes according to type

            }
        });
        setTimeout(function(){
          controller.init();
        }, 0);
    }

})();
