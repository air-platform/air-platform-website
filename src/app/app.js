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
            })
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
    }

};
    // Initialize app and store it to myApp variable for futher access to its methods
    var myApp = new Framework7({
        modalTitle: 'Air Community',
        // animateNavBackIcon: true,
        // hideNavbarOnPageScroll: true,
        // scrollTopOnNavbarClick: true,
        // pushState: true,
        // sortable: false,
        // swipeout: false,
        angular: true,
        modalButtonOk:'确定',
        modalButtonCancel:'取消'
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
    // Now we need to run the code that will be executed only for About page.

    // Option 1. Using page callback for page (for "about" page in this case) (recommended way):
    // myApp.onPageInit('login-screen', function (page) {
    //     // Do something here for "about" page
    //     console.log(page.query);
    // })
    // myApp.onPageInit('login-screen', function (page) {
    //     var pageContainer = $$(page.container);
    //     pageContainer.find('.login-goto-register').on('click',function () {
    //         console.log('register app.js');
    //         // mainView.router.back();
    //     });
    //     pageContainer.find('.login-cancel').on('click',function () {
    //         console.log('register app.js');
    //         mainView.router.back();
    //     });
    //     pageContainer.find('.login-btn').on('click', function () {
    //         var username = pageContainer.find('input[name="username"]').val();
    //         var password = pageContainer.find('input[name="password"]').val();
    //         // Handle username and password
    //         myApp.alert('Username: ' + username + ', Password: ' + password, function () {
    //             mainView.router.back();
    //         });
    //     });
    // });

    // myApp.onPageInit('register-screen', function (page) {
    //     var pageContainer = $$(page.container);
    //     pageContainer.find('.register-back').on('click',function () {
    //         mainView.router.back();
    //     });
    //     pageContainer.find('.register-btn').on('click', function () {
    //         var username = pageContainer.find('input[name="username"]').val();
    //         var password = pageContainer.find('input[name="password"]').val();
    //         var authcode = pageContainer.find('input[name="auth"]').val();
    //
    //
    //
    //         // Handle username and password
    //         myApp.alert('Username: ' + username + ', Password: ' + password + ', auth' + authcode, function () {
    //             mainView.router.back();
    //         });
    //     });
    // });


    // // Option 2. Using one 'pageInit' event handler for all pages:
    // $$(document).on('pageInit', function (e) {
    //     // Get page data from event data
    //     var page = e.detail.page;
    //     console.log(page.name);
    //
    // })

    // // Option 2. Using live 'pageInit' event handlers for each page
    // $$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    //     // Following code will be executed for page with data-page attribute equal to "about"
    //     // myApp.alert('Here comes About page');
    // })



// })();



