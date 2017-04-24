// (function () {
//     'use strict';



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

// })();



