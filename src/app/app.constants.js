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
            apiHost_ONLINE:'http://10.73.206.33:8080/api/v1/',
            apiHost_OFFLINE:'http://172.29.56.47:8080/api/v1/',
            supportTelephone:'400-666-4388',
            token:'airspc_access_token',
            information:'airspc_information',
            notification_refresh_information:'airspc_notification_refresh_information',
            router:{
                login:{
                  login:'app/components/login/login.html',
                  register:'app/components/login/register.html',
                  reset:'app/components/login/reset.html'
                },
                airjet:{
                    home:'app/components/airjet/airjet.html'
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
                    orderdetail:'app/components/order/orderdetail.html',
                    orderadd:'app/components/order/orderadd.html'
                },
                set:{
                    setting:'app/components/setting/setting.html',
                    profile:'app/components/profile/profile.html'
                }
            }
        });
})();
