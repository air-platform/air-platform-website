/**
 * Created by Otherplayer on 2017/1/9.
 */
(function () {
    'use strict';

    /**
     * 首字母大写
     *
     */
    angular
        .module('airsc')
        .filter('capitalize', capitalize);

    /** @ngInject */
    function capitalize() {
        return function (input) {        //input是我们传入的字符串
            if (input) {
                return input[0].toUpperCase() + input.slice(1);
            }
        };
    };


    angular
        .module('airsc')
        .filter('descTime', descTime);

    /** @ngInject */
    function descTime() {

        return service;


        function service(input) {

            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;

            var date = new Date(input);
            var now = new Date().getTime();
            var bef = date.getTime();

            var diffValue = now - bef;
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            var result = '';
            if (monthC >= 1) {
                // result = parseInt(monthC) + "个月前";
                return (date.getFullYear() + "/" + date.getMonth() + 1) + "/" + date.getDate();
            }
            else if (weekC >= 1) {
                result = parseInt(weekC) + "周前";
            }
            else if (dayC >= 1) {
                result = parseInt(dayC) + "天前";
            }
            else if (hourC >= 1) {
                result = parseInt(hourC) + "个小时前";
            }
            else if (minC >= 1) {
                result = parseInt(minC) + "分钟前";
            } else
                result = "刚刚";

            return result;
        }

    };






    /**
     * 字符串转换为数字
     *
     */
    angular
        .module('airsc')
        .filter('num', num);

    /** @ngInject */
    function num() {
        return function (input) {        //input是我们传入的字符串
            if (input) {
                return Number(input);
            }
        };
    };


    /**
     * 数字转换为人民币格式
     *
     */
    angular
        .module('airsc')
        .filter('RMB', rmb);

    /** @ngInject */
    function rmb() {
        return function (number, unit) {
            if (number) {
                var result = '';
                var num = Number(number).toFixed(1).split('.');
                if ((number + '').length >= 5) {
                    num = (Number(number) / 10000).toFixed(1).split('.');
                }
                var int = num[0];
                var float = num[1];
                while (int.length > 3) {
                    result = ',' + int.slice(-3) + result;
                    int = int.slice(0, int.length - 3);
                }
                if (int) {
                    result = int + result;
                }
                if (Number(float) !== 0) {
                    result += '.' + float;
                }
                if(angular.isDefined(unit)){
                    result = unit + result;
                } else {
                    result = '¥' + result;
                }
                if ((number + '').length >= 5) {
                    result += '万';
                } else {
                    result += '';
                }
                return result;
            }
        };
    };

    /**
     * 字符串限制长度并加省略号。
     *
     */
    angular
        .module('airsc')
        .filter('characters', characters);
    function characters() {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) {
                return input;
            }
            if (chars <= 0) {
                return '';
            }
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length - 1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '…';
            }
            return input;
        };
    };

    /**
     * 日期转换为中国日期
     *
     */
    angular
        .module('airsc')
        .filter('chinaweek', chinaweek);
    function chinaweek() {
        return function (input) {
            if(input){
                var weekArr = {
                    "周一": "Mon",
                    "周二": "Tue",
                    "周三": "Wed",
                    "周四": "Thu",
                    "周五": "Fri",
                    "周六": "Sat",
                    "周日": "Sun"
                };
                for (var key in weekArr) {
                    if (input.indexOf(weekArr[key]) !== -1) {
                        input = input.replace(weekArr[key], key);
                        break;
                    }
                }
            }

            return input;
        };
    };

    /**
     * 一百以下数字转换为中国数字
     *
     */
    angular
        .module('airsc')
        .filter('chinanum', chinanum);
    function chinanum() {
        return function (num) {
            var ary = num + '';
            var ary0 = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
            if (ary.length === 1) {
                return ary0[Number(ary)]
            } else if (ary.length === 2) {
                if (ary[0] === '1') {
                    if (ary[1] === '0') {
                        return ary0[10];
                    } else {
                        return ary0[10] + ary0[Number(ary[1])];
                    }
                } else {
                    if (ary[1] === '0') {
                        return ary0[Number(ary[0])] + ary0[10];
                    } else {
                        return ary0[Number(ary[0])] + ary0[10] + ary0[Number(ary[1])];
                    }
                }
            }
        };
    };


    angular
        .module('airsc')
        .factory('iotUtil', iotUtil);

    /** @ngInject */
    function iotUtil(StorageService,constdata) {
        var service = {
            uuid: uuid,
            isNull: isNull,
            pagesize: pagesize,
            htmlToPlaintext: htmlToPlaintext,
            getKeyValueFromURL: getKeyValueFromURL,
            islogin: islogin,
            userInfo: userInfomation,
        };
        return service;

        ////////////////////

        function islogin() {
            var token = StorageService.get(constdata.token);
            if (token && token.length > 0){
                return true;
            }
            return false;
        }
        function userInfomation() {
            var info = StorageService.get(constdata.information);
            return info;
        }
        function uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "";

            var uuid = s.join("");
            return uuid;
        }
        function isNull(str) {
            if (!str || str == "") return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        }
        function pagesize() {
            var hnaInfo = 'airspc.information';
            var infomation = StorageService.get(hnaInfo);
            var pageSizeKey = 'airspc.pagesize.' + infomation.username;
            var tempPageSize = StorageService.get(pageSizeKey);
            if (tempPageSize && tempPageSize != 'undefined') {
                return tempPageSize;
            }
            return 10;
        }
        function htmlToPlaintext(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }
        function getKeyValueFromURL(key, urlstring) {
            var tempData = urlstring.split(key + '=');
            if (tempData.length == 1) {
                return 'undefined';
            }
            var lastPath = tempData.pop();
            tempData = lastPath.split('&');
            var result = tempData[0];
            return result;
        }
    }


    angular
        .module('airsc')
        .factory('deepcopy', deepcopy);

    /** @ngInject */
    function deepcopy() {
        var service = {
            copy: copy
        };
        return service;

        ////////////////////

        function copy(source) {
            var result = {};
            for (var key in source) {
                result[key] = typeof source[key] === 'object' ? copy(source[key]) : source[key];
            }
            return result;
        }
    }


    // /**
    //  * 过滤器:国际化
    //  *
    //  */
    // angular
    //     .module('airsc')
    //     .filter("T", T);
    //
    // /** @ngInject */
    // function T($translate) {
    //     return function(key) {
    //         if(key){
    //             return $translate.instant(key);
    //         }
    //         return key;
    //     };
    // }


    /**
     * 服务:国际化
     *
     */
    angular
        .module('airsc')
        .factory("i18n", i18n);

    /** @ngInject */
    function i18n($translate) {
        var service = {
            t: translate,
            value: translate
        };
        return service;

        ////////////////////

        function translate(key) {
            if (key) {
                return $translate.instant(key);
            }
            return key;
        }
    }


    /**
     * 日志:logger
     *
     */
    angular
        .module('airsc')
        .factory('logger', logger);

    /** @ngInject */
    function logger(constdata) {

        var mod = {
            log: 1,
            debug: 2,
            info: 4,
            warn: 8,
            error: 16
        };
        var debugMode = constdata.debugMode;
        var logLevel = parseInt(constdata.logLevel, 2);


        var service = {
            log: log,
            err: err,
            error: err,
            warn: warn,
            info: info,
            debug: debug
        };

        return service;


        ///////////////////


        function log(args) {
            if (__showLevel('log')) {
                console.log(args);
            }
        }

        function err(args) {
            if (__showLevel('error')) {
                console.error(args);
            }
        }

        function warn(args) {
            if (__showLevel('warn')) {
                console.warn(args);
            }
        }

        function info(args) {
            if (__showLevel('info')) {
                console.info(args);
            }
        }

        function debug(args) {
            if (__showLevel('debug')) {
                console.log(args);
            }
        }

        function __showLevel(name) {
            var isValid = logLevel & mod[name];
            return debugMode && isValid;
        }
    }

})();

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.clone = function () {
    return this.slice(0);
};
Array.prototype.isEmpty = function (val) {
    if (!val) return true;
};

// /*
//  用途：检查输入字符串是否只由英文字母和数字和文字组成
//  输入：
//  s：字符串
//  返回：
//  如果通过验证返回true,否则返回false
//
//  */
// function noSpecialSymbols(s) {
//     var regu = "^[\a-\z\A-\Z0-9\u4E00-\u9FA5\_\:\.\{\} ]+$";
//     var re = new RegExp(regu);
//     if (re.test(s)) {
//         return true;
//     } else {
//         return false;
//     }
// }
//
// /*
//  用途：检查输入字符串是否只由英文字母和数字和文字组成
//  输入：
//  s：字符串
//  返回：
//  如果通过验证返回true,否则返回false
//
//  */
// function isNumber_Letter(s) {
//     var regu = "^[\a-\z\A-\Z0-9\_]+$";
//     var re = new RegExp(regu);
//     if (re.test(s)) {
//         return true;
//     } else {
//         return false;
//     }
// }
// /*
//  用途：检查输入字符串是否为空或者全部都是空格
//  输入：str
//  返回：
//  如果全是空返回true,否则返回false
//  */
// function isNull( str )
// {
//     if ( !str || str == "" ) return true;
//     var regu = "^[ ]+$";
//     var re = new RegExp(regu);
//     return re.test(str);
// }