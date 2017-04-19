/**
 * Created by Otherplayer on 2016/12/12.
 */

(function () {
    'use strict';


    /**
     *
     * facotry是一个单例,它返回一个包含service成员的对象。
     * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
     *
     */
    angular
        .module('airsc')
        .factory('OrderServer', OrderServer);

    /** @ngInject */
    function OrderServer(NetworkService) {

        var service = {
            passengers: passengers,
            addPassenger: addPassenger,
            submitOrder: submitOrder
        };

        return service;

        ////////////

        function passengers(successHandler,failedHandler) {
            NetworkService.get('user/passengers',null,successHandler,failedHandler);
        }
        function addPassenger(param,successHandler,failedHandler) {//name、mobile、identity
            NetworkService.post('user/passengers',param,successHandler,failedHandler);
        }
        function submitOrder(flightId,param,successHandler,failedHandler) {//name、mobile、identity
            NetworkService.post('user/ferryflight/orders/' + flightId,param,successHandler,failedHandler);
        }
    }



})();
