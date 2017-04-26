/* global angular:false, malarkey:false, moment:false */
(function () {
    'use strict';

    // Constants used by the entire app
    angular.module('airsc')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('constdata', {
            debugMode: true,
            logLevel: 111111,//控制log显示的级别（0不显示,1显示）,从左到右每位分别代表[error,warn,info,debug,log]
            apiHost_ONLINE:'http://aircommunity.net/api/v1/',
            apiHost_OFFLINE:'http://aircommunity.net/api/v1/',
            ipCurrent: 'http://aircommunity.net/airbb',
            supportTelephone:'400-0666-888',
            token:'airspc_access_token',
            information:'airspc_information',
            notification_refresh_information:'airspc_notification_refresh_information',
            notification_refresh_order_status:'notification_refresh_order_status',
            account_list:'aircommunity.account.list',
            page:{size:20},
            router:{
                login:{
                  login:'app/components/login/login.html',
                  register:'app/components/login/register.html',
                  reset:'app/components/login/reset.html'
                },
                airjet:{
                    home:'app/components/airjet/airjet.html',
                    travel:'app/components/airjet/airjet.html?tabActive=travel-plan',
                    dream:'app/components/airjet/airjet.html?tabActive=dream-flying',
                    card:'app/components/airjet/airjet.html?tabActive=card-sevice',
                    ordersuccess:'app/components/airjet/order-success.html'
                },
                airtaxi:{
                    home:'app/components/airtaxi/airtaxi.html'
                },
                airtrans:{
                    home:'app/components/airtransportation/airtrans.html'
                },
                airtour:{
                    home:'app/components/airtour/airtour.html'
                },
                airtrain:{
                    home:'app/components/airtrain/airtrain.html'
                },
                order:{
                    order:'app/components/order/order.html',
                    orderadd:'app/components/order/orderadd.html',
                    detail:{
                        taxi:'app/components/order/orderdetail.html',
                        transportation:'app/components/order/orderdetail.html',
                        ferryflight:'app/components/airjet/dream-detail.html',
                        fleet:'app/components/airjet/travel-detail.html',
                        jetcard:'app/components/airjet/tour-order.html',
                        course:'app/components/order/ordercoursedetail.html'
                    }
                },
                comment:{
                    add:'app/components/comment/comment.html'
                },
                set:{
                    setting:'app/components/setting/setting.html',
                    profile:'app/components/profile/profile.html'
                },
                protocal:{
                    announce:'app/components/about/protocal-announce.html',
                    safefixedwing:'app/components/about/protocal-safe-fixedwing.html',
                    safehelicopter:'app/components/about/protocal-safe-helicopter.html'
                }
            }
        });
})();
