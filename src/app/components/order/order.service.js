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
            submitOrder: submitOrder,
            cancelOrder: cancelOrder,
            deleteOrder: deleteOrder,
            getOrders: getOrders,
            getOrder: getOrder
        };

        return service;

        ////////////

        function passengers(successHandler,failedHandler) {
            NetworkService.get('user/passengers',null,successHandler,failedHandler);
        }
        function addPassenger(param,successHandler,failedHandler) {//name、mobile、identity
            NetworkService.post('user/passengers',param,successHandler,failedHandler);
        }
        function submitOrder(param,successHandler,failedHandler) {//name、mobile、identity
            NetworkService.post('user/airtransport/orders/',param,successHandler,failedHandler);
        }
        function cancelOrder(flightId,successHandler,failedHandler) {
            NetworkService.post('user/orders/' + flightId + '/cancel',null,successHandler,failedHandler);
        }
        function deleteOrder(flightId,successHandler,failedHandler) {
            NetworkService.delete('user/orders/' + flightId,null,successHandler,failedHandler);
        }
        function getOrders(type,page,successHandler,failedHandler) {
            var path = '';
            if (1 === type){path = '/pending';
            }else if (2 === type){path = '/finished';
            }else if (3 === type){path = '/cancelled';
            }else {path = '';
            }
            NetworkService.get('user/orders' + path  + '?pageSize=5&page=' + page,null,successHandler,failedHandler);
        }
        function getOrder(orderId,successHandler,failedHandler) {
            NetworkService.get('user/orders/' + orderId,null,successHandler,failedHandler);
        }
    }



})();
