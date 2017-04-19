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
            getLatestComment: getLatestComment,
            getComments: getComments
        };

        return service;

        ////////////

        function submitComment(orderId,param,successHandler,failedHandler) {
            NetworkService.post('comments?order=' + orderId,param,successHandler,failedHandler);
        }
        function getComments(productId,page,successHandler,failedHandler) {
            NetworkService.get('comments?product=' + productId + '?pageSize=20&page=' + page,null,successHandler,failedHandler);
        }
        function getLatestComment(productId,successHandler,failedHandler) {
            NetworkService.get('comments?product=' + productId + '?page=1&pageSize=1',null,successHandler,failedHandler);
        }
    }



})();
