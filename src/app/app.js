// (function () {
//     'use strict';

Framework7.prototype.plugins.angular = function(app, params) {
    function compile(newPage) {
        try {
            var $page = $(newPage);
            var injector = angular.element("[ng-app]").injector();
            var $compile = injector.get("$compile");
            var $timeout = injector.get("$timeout");
            var $scope = injector.get("$rootScope");
            $scope = $scope.$$childHead;
            $timeout(function() {
                $compile($page)($scope);
            });
        } catch (e) {
            //console.error("Some Error Occured While Compiling The Template", e);
        }
    }

    return {
        hooks: {
            pageInit: function(pageData) {
                compile(pageData.container);
            }
        }
    };

};

    // Initialize app and store it to myApp variable for futher access to its methods
    var myApp = new Framework7({
        modalTitle: 'Air Community',
        // animateNavBackIcon: true,
        // hideNavbarOnPageScroll: true,
        // scrollTopOnNavbarClick: true,
        // pushState: true,
        // sortable: false,
        // swipeout: true,
        angular: true,
        modalButtonOk:'确定',
        modalButtonCancel:'取消',
        smartSelectBackOnSelect: true
        // // Hide and show indicator during ajax requests
        // onAjaxStart: function (xhr) {
        //     myApp.showIndicator();
        // },
        // onAjaxComplete: function (xhr) {
        //     myApp.hideIndicator();
        // }
    });

    // We need to use custom DOM library, let's save it to $$ variable:
    var $$ = Dom7;

    // Add view
    // Because we want to use dynamic navbar, we need to enable it for this view:
    var mainView = myApp.addView('.view-main', {
        dynamicNavbar: true
    });

    $$(document).on('navbarInit', function (e) {
        var navbar = e.detail.navbar;
        var page = e.detail.page;
        // console.log(navbar);
    });

    myApp.onPageInit('infinite-scroll', function (page) {
        //注册监听上拉加载
        console.log('----infinite-scroll');
    });

    // myApp.onPageBeforeInit('*', function () {
    //     document.querySelector('.page-loading').style.display = 'block';
    // });
    //
    // myApp.onPageAfterAnimation('*', function () {
    //     document.querySelector('.page-loading').style.display = 'none';
    // });

// })();



