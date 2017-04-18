/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airsc').controller('settingController', settingController);

    /** @ngInject */
    function settingController($scope, $rootScope, iotUtil, i18n) {


        $scope.gotoDetail = gotoDetail;

        function gotoDetail() {
            mainView.router.loadPage('app/components/setting/password.html');
        }


        var myApp = new Framework7();

        var $$ = Dom7;

        // 加载flag
        var loading = false;

// 上次加载的序号
        var lastIndex = $$('.list-block li').length;

// 最多可加载的条目
        var maxItems = 60;

// 每次加载添加多少条目
        var itemsPerLoad = 20;

// 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {

            // 如果正在加载，则退出
            if (loading) return;

            // 设置flag
            loading = true;

            // 模拟1s的加载过程
            setTimeout(function () {
                // 重置加载flag
                loading = false;

                if (lastIndex >= maxItems) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    myApp.detachInfiniteScroll($$('.infinite-scroll'));
                    // 删除加载提示符
                    $$('.infinite-scroll-preloader').remove();
                    return;
                }

                // 生成新条目的HTML
                var html = '';
                for (var i = lastIndex + 1; i <= lastIndex + itemsPerLoad; i++) {
                    html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
                }

                // 添加新条目
                $$('.list-block ul').append(html);

                // 更新最后加载的序号
                lastIndex = $$('.list-block li').length;
            }, 1000);
        });



    }

})();
