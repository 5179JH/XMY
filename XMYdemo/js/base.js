

// 无限制请求
// function index_ajax(args, url, method, async, callback) {
//     $.ajax({
//         'url': url,
//         'data': args,
//         'type': method,
//         "async": async,
//         success: function(result) {
//             callback(result);
//         }
//     });
// };

// 时间倒计时自定义函数 
function getCountDowns(clas, timestamp) {
    is_intval = setInterval(function() {
        var nowTime = new Date();
        var endTime = new Date(timestamp * 1000);
        var t = endTime.getTime() - nowTime.getTime();
        var day = parseInt(t / 1000 / 60 / 60 / 24);
        var hour = Math.floor(t / 1000 / 60 / 60 % 24);
        var min = Math.floor(t / 1000 / 60 % 60);
        var sec = Math.floor(t / 1000 % 60);

        if (sec < 0) {
            clearInterval(is_intval);
            $(clas).find('.time-d').html('00');
            $(clas).find('.time-h').html('00');
            $(clas).find('.time-m').html('00');
            $(clas).find('.time-s').html('00');
            return false;
        }

        if (sec < 10) {
            sec = "0" + sec;
        }

        var countDownDay = day;
        var countDownHour = hour;
        var countDownMin = min;
        var countDownSec = sec;
        $(clas).find('.time-d').html(countDownDay);
        $(clas).find('.time-h').html(countDownHour);
        $(clas).find('.time-m').html(countDownMin);
        $(clas).find('.time-s').html(countDownSec);
    }, 1000);
};

// 时间戳转化时间字符串
function get_timepoint(date) {
    //如果date为13位不需要乘1000
    var date = new Date(date * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}

// 获取时间后进行时间字符串切割 get_timepoint(item.update_time).slice(0, 11)
// 时间字符串转时间戳
function get_timestamp(time) {
    var time = time.replace(/-/g, '/');
    time = (new Date(time).getTime()) / 1000;
    return time;
}

// html转字符串
function get_string(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#039;');
    return str;
};

// 字符串转html
// function get_html(string, quote_style) {
//     var optTemp = 0,
//         i = 0,
//         noquotes = false;
//     if (typeof quote_style === 'undefined') {
//         quote_style = 2;
//     }
//     string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
//     var OPTS = {
//         'ENT_NOQUOTES': 0,
//         'ENT_HTML_QUOTE_SINGLE': 1,
//         'ENT_HTML_QUOTE_DOUBLE': 2,
//         'ENT_COMPAT': 2,
//         'ENT_QUOTES': 3,
//         'ENT_IGNORE': 4
//     };
//     if (quote_style === 0) {
//         noquotes = true;
//     }
//     if (typeof quote_style !== 'number') {
//         quote_style = [].concat(quote_style);
//         for (i = 0; i < quote_style.length; i++) {
//             if (OPTS[quote_style[i]] === 0) {
//                 noquotes = true;
//             } else if (OPTS[quote_style[i]]) {
//                 optTemp = optTemp | OPTS[quote_style[i]];
//             }
//         }
//         quote_style = optTemp;
//     }
//     if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
//         string = string.replace(/&#0*39;/g, "'");
//     }
//     if (!noquotes) {
//         string = string.replace(/&quot;/g, '"');
//     }
//     string = string.replace(/&amp;/g, '&');
//     return string;
// }

// 解析url
function get_url() {
    var search = window.location.search.replace('?', '');
    var arr = search.split('&');
    var obj = {};
    $.each(arr, function(index, item) {
        var key = item.split('=')[0];
        var value = item.split('=')[1];
        obj[key] = value;
    })
    return obj;
}

// 开启加载
// Loading() // 加载
function Loading() {
    var load_html = '<div class="a-load"><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i></div>';
    $('body').append(load_html)
};

// 关闭加载
// LoadClose() // 关闭加载
function LoadClose() {
    $('.a-load').remove();
};

//获取字符串长度 ：中文长度为2
stringLength = function(thisDom,numb) {
    var cArr = thisDom.value.match(/[^\x00-\xff]/ig);
    var length;
    if ( cArr == null) {
        length =  thisDom.value.length;
        if (length >=numb) {
            thisDom.value = thisDom.value.slice(0,numb)
        }
    }else{
        length = thisDom.value.length+cArr.length
        if (length >=numb) {
            thisDom.value = thisDom.value.slice(0,numb/2)
        }
    }
};

























