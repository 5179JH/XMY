//引入layer
//document.write("<scr"+"ipt src='3.js'></scr"+"ipt>")

$(document).on("click", ".wkbf-right-main-switch label", function (event) {
    var is_show = 1;
    if ($(this).children('span').hasClass('switch-on')) {
        var html = '<span class="switch-off" id="switch-1" style="border-color: rgb(223, 223, 223); box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset; background-color: rgb(255, 255, 255);"><span class="slider"></span></span>';
        $('.wkbf-right-main-content').hide();
        $('#wkbf-zd1').hide();
        var is_show = 1;
    } else {
        var html = '<span class="switch-on" id="switch-1" style="border-color: rgb(100, 189, 99); box-shadow: rgb(100, 189, 99) 0px 0px 0px 16px inset; background-color: rgb(100, 189, 99);"><span class="slider"></span></span>';
        $('.wkbf-right-main-content').show();
        var is_show = 0;
    }
    var _data = {
        is_show: is_show
    };
    console.log(_data);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "/member/Wxmessage/setSwitch",
        data: _data,
        success: function (res) {
            if (res.code == 1) {

            } else {

            }
            result = res;
        }
    });
    $(this).html(html);
});


/**
 * 切换微信号
 */
$(document).on("click", ".choose-wxgzh-list-li1", function (event) {
    var _data = {
        wechatid: $(this).attr('data-id')
    };
    console.log(_data);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "/member/Wxmessage/setWechatid",
        data: _data,
        success: function (res) {
            if (res.code == 1) {
                window.location.reload();
            } else {
                layer.msg(res.msg);
                return false;
            }
        }
    });
});

/**
 * 添加公众号
 */
$(document).on("click", ".choose-wxgzh-list-li2", function (event) {
    window.location.href = '/member/wxmanage/wxaccredit.html';
});


/**
 * 上传图片-被关注回复
 * @param files
 */
function uploadImg(file) {
    var result = new Object();
    //判断图片类型
    if ((file.type).indexOf("image/") == -1) {
        result.code = 0;
        result.msg = '图片格式不正确'
        return result;
    }

    if (file.size.toFixed(1) > 2 * 1024 * 1024) {
        result.code = 0;
        result.msg = '请选择小2M的图片'
        return result;
    }
    var formData = new FormData();
    formData.append('image', file);
    $.ajax({
        url: "/member/Wxupload/uploadImage",
        data: formData,
        type: 'POST',
        async: false,
        contentType: false,
        processData: false,
        success: function (res) {
            result = res;
        }
    });
    return result;
}


function tip(file) {


}


/**
 * 上传音频
 * @param files 音频
 */
function uploadVoice(file) {
    var result = new Object();
    //判断音频类型
    if ((file.type).indexOf("audio/") == -1) {
        result.code = 0;
        result.msg = '音频格式不正确'
        return result;
    }
    if (file.size.toFixed(1) > 2 * 1024 * 1024) {
        result.code = 0;
        result.msg = '请选择小2M的音频'
        return result;
    }
    var formData = new FormData();
    formData.append('voice', file);
    $.ajax({
        url: "/member/Wxupload/uploadVoice",
        data: formData,
        type: 'POST',
        async: false,
        contentType: false,
        processData: false,
        success: function (res) {
            result = res;
        },

    });
    return result;
}

/**
 * 上传视频
 * @param files 视频
 */
function uploadVideo(file) {
    var result = new Object();
    //判断视频类型
    if ((file.type).indexOf("video/") == -1) {
        result.code = 0;
        result.msg = '视频格式不正确'
        return result;
    }
    if (file.size.toFixed(1) > 10 * 1024 * 1024) {
        result.code = 0;
        result.msg = '请选择小10M的视频'
        return result;
    }
    var formData = new FormData();
    formData.append('image', file);
    $.ajax({
        url: "/member/Wxupload/uploadVideo",
        data: formData,
        type: 'POST',
        async: false,
        contentType: false,
        processData: false,
        success: function (res) {
            console.log(res);
            result = res;
        }
    });
    return result;
}

/**
 * 语音点击统计
 * file  文件路径
 * type  0为语音 1为图片
 * source  0为用户上传，1为粉丝发送
 * m_id  语音素材ID
 * return  没有返回值
 */
function voiceStatistics(file, m_id, type, source) {
    if (file == undefined) {
        return false;
    }
    if (m_id == undefined) {
        return false;
    }
    if (type == undefined) {
        type = 0;
    }
    if (source == undefined) {
        source = 0;
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "/member/wxinfo/statistics",
        data: {"file": file, "m_id": m_id, "type": type, "source": source},
        success: function (msg) {   //function1()

        }
    });


}

//将emoji转小图
function emoji2img(str) {
    $.ajaxSettings.async = false;
    setTimeout(function () {
        $.ajaxSettings.async = true;
    }, 1000);
    $.getJSON("/emojiarr.json", function (data) {
        console.log(data);
        $.each(data, function (k, val) {
            var re = new RegExp(k, 'ig');
            str = str.replace(re, '<img src="' + val + '" style="width: 20px;">');
        });
        $.getJSON("/emoji.json", function (array) {
            console.log(array);
            $.each(array, function (k, val) {
                $.each(val, function (key, item) {
                    var re = new RegExp("" + item['emoji'] + "", 'g');
                    str = str.replace(re, '<img style="width:20px;" src="' + item['url'] + '" alt="' + item['title'] + '">');
                })
            })
        })
    });
    return str;
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

// ajax请求方法
function ajax_none(args, url, method, async, callback) {
    $.ajax({
        'url': url,
        'data': args,
        'type': method,
        "async": async,
        success: function(result) {
            callback(result);
        }
    });
};

// 时间戳转时间字符串
function time_Stamp(date) {
    var date = new Date(date * 1000);//如果date为13位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}
// time_Stamp(item.update_time).slice(0, 11)
// 时间字符串转时间戳
function Stamp_time(time){
    var time = time.replace(/-/g,'/');
    time = (new Date(time).getTime())/1000;
    return time;
}

