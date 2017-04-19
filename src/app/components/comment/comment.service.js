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
        .factory('CommentServer', CommentServer);

    /** @ngInject */
    function CommentServer(NetworkService) {

        var service = {
            submitComment: submitComment,
            getComments: getComments
        };

        return service;

        ////////////

        function submitComment(orderId,param,successHandler,failedHandler) {
            NetworkService.post('comments?order=' + orderId,param,successHandler,failedHandler);
        }
        function getComments(productId,successHandler,failedHandler) {
            NetworkService.get('comments?product=' + productId,null,successHandler,failedHandler);
        }
    }



})();
