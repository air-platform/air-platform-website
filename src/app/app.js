// (function () {
//     'use strict';

    // Initialize app and store it to myApp variable for futher access to its methods
    var myApp = new Framework7();

    // We need to use custom DOM library, let's save it to $$ variable:
    var $$ = Dom7;

    // Add view
    var mainView = myApp.addView('.view-main', {
        // Because we want to use dynamic navbar, we need to enable it for this view:
        dynamicNavbar: true
    });

    // Now we need to run the code that will be executed only for About page.

    // Option 1. Using page callback for page (for "about" page in this case) (recommended way):
    myApp.onPageInit('about', function (page) {
        // Do something here for "about" page

    })

    myApp.onPageInit('login-screen', function (page) {
        var pageContainer = $$(page.container);
        pageContainer.find('.login-goto-register').on('click',function () {
            console.log('register app.js');
            // mainView.router.back();
        });
        pageContainer.find('.login-cancel').on('click',function () {
            console.log('register app.js');
            mainView.router.back();
        });
        pageContainer.find('.login-btn').on('click', function () {
            var username = pageContainer.find('input[name="username"]').val();
            var password = pageContainer.find('input[name="password"]').val();
            // Handle username and password
            myApp.alert('Username: ' + username + ', Password: ' + password, function () {
                mainView.router.back();
            });
        });
    });

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
    myApp.onPageInit('reset-password-screen', function (page) {
        var pageContainer = $$(page.container);
        pageContainer.find('.login-goto-register').on('click',function () {
            console.log('register app.js');
            // mainView.router.back();
        });
        pageContainer.find('.reset-back').on('click',function () {
            mainView.router.back();
        });
        pageContainer.find('.login-btn').on('click', function () {
            var username = pageContainer.find('input[name="username"]').val();
            var password = pageContainer.find('input[name="password"]').val();
            // Handle username and password
            myApp.alert('Username: ' + username + ', Password: ' + password, function () {
                mainView.router.back();
            });
        });
    });

    // Option 2. Using one 'pageInit' event handler for all pages:
    $$(document).on('pageInit', function (e) {
        // Get page data from event data
        var page = e.detail.page;

        if (page.name === 'about') {
            // Following code will be executed for page with data-page attribute equal to "about"
            // myApp.alert('Here comes About page');
            console.log(page.name);
        }
    })

    // Option 2. Using live 'pageInit' event handlers for each page
    $$(document).on('pageInit', '.page[data-page="about"]', function (e) {
        // Following code will be executed for page with data-page attribute equal to "about"
        // myApp.alert('Here comes About page');
    })



// })();



