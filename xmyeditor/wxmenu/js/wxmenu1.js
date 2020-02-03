var layedit;
var text_index;
var active;
// 编辑器
layui.use('layedit', function () {
    layedit = layui.layedit
        , $ = layui.jquery;

    //自定义工具栏
    text_index = layedit.build('text_textarea', {
        tool: ['face', 'link', 'unlink']
        , height: 200
    });

    // 编辑器外部操作 ， 获取内容
    active = {
        content:function(){ // 获取内容
            return layedit.getContent(text_index);
        }
        ,text:function(){ // 获取内容
            return layedit.getText(text_index);
        }
    };
    // 实时监测工具
    $("iframe[textarea=text_textarea]").contents().find("body").keyup(function(){
        console.log(1);
        var cont = active['content'] ? active['content'].call(this) : '';
        var contall = cont;
        // 过滤
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var imgarr = cont.match(imgReg);  // arr 为包含所有img标签的数组
        cont =  cont.replace(/<img[^>]*\/?>/g,'');
        cont = cont.replace(/<p\>|<\/p>|<br\/?>/g,'');
        var conlen = cont.length;
        var imglen = 0;
        if(imgarr != null){
            imglen = (imgarr.length)*4;
        }
        if(conlen > 0){
            // 清空
            removeError();
            setDescArray('type', 'text');
            setDescArray('value', contall);
            $('.wkzc-right-set-content').find('.wkzc-right-set-content-div').show();
            $('.wkzc-right-set-content').find('.wkzc-right-set-msg-content').hide().html('');
            // fill_from(getDescArray());
        }
        var len = contall.getBytes();
        var inputlen = 230 - len;
        if(inputlen >= 0){
            var newl = '';
        }else{
            inputlen = 0;
            var newl = '（已超出'+(len-230)+'字）';
        }
        $('.wkzc-right-set-position-footer-p').find('span').html(inputlen);
        $('.wkzc-right-set-position-footer-p').find('p').eq(1).html(newl);
    });
});

/**
 * 退出预览
 */
$(document).on("click", ".wkzc-phone-btn", function () {
    $('.wkzc-phone-bg').hide();
});



//把左侧的菜单值赋值给右侧的页面
function fill_from(menuObj) {
    //当没有数据时，需要清空右侧的菜单
    $(".wkzc-right-much .wkzc-right-name input").val(menuObj.name);
    //清空页面地址
    $('.wkzc-right-main-msg-p input').val('');
    //文字清空
    layedit.setContent(text_index,'');
    //清空之前的显示效果并切换显示
    $('.wkzc-right-set-content').find('.wkzc-right-set-content-div').show();
    $('.wkzc-right-set-content').find('.wkzc-right-set-msg-content').hide().html('');
    if (!menuObj.hasOwnProperty('type')) {
        //切换到发送消息
        ichange(0);
        $('.wkzc-right-main-tit p').removeClass('wkzc-right-main-tit-p').eq(0).addClass('wkzc-right-main-tit-p');
        $('.wkzc-right-main-tit p:eq(0)').click();
        $(".wkzc-right-content-div > div:eq(0)").click();
        return false;
    }
    var html2 = '';
    switch (menuObj.type) {
        case 'news':
            //根据素材ID获取文章列表内容
            $.ajax({
                type: 'POST',
                dataType: 'json',
                traditional: true,
                url: "/member/Wxmenu/getMeida",
                data: {mid: menuObj.media_id},
                success: function (res) {
                    if (res.code == 1) {
                        var news_lists = res.data.news_item;
                        var html = '';
                        html += '<div class="wkbf-ft" data-type="news" data-url="' + menuObj.murl + '" media_id="' + menuObj.media_id + '">';
                        html += '  <div class="wkbf-ff"> ';
                        html += '  <div class="wkbf-deleat">删除</div>';
                        html += '   <div class="wkbf-gj-img-ll"> ';
                        for (var i in news_lists) {
                            if (i == 0) {
                                html += '   <a href="' + news_lists[i].url + '" target="_blank"> ';
                                html += '      <div class="wkbf-gj-img-s"> ';
                                html += '         <div class="wkbf-gj-add-pop">预览文章</div>';
                                html += '      <img src="' + news_lists[i].thumb_url + '" alt="" style="width: 261px;height: 150px;" /> ';
                                html += '      <div class="wkbf-gj-img-v">';
                                html += '       <p class="wkbf-gj-img-s-p">' + news_lists[i].digest + '</p>';
                                html += '     </div> ';
                                html += '    </div></a> ';
                            } else {
                                html += '    <a href="' + news_lists[i].url + '" target="_blank"><div class="wkbf-gj-add"> ';
                                html += '     <div class="wkbf-gj-add-pop1">预览文章</div>';
                                html += '     <p>' + news_lists[i].digest + '</p> ';
                                html += '      <img src="' + news_lists[i].thumb_url + '" alt="" style="width: 60px;height: 60px;" /> ';
                                html += '     </div> </a> ';
                            }
                        }
                        html += '  </div> ';
                        //html += '  <div class="wkbf-dele">';
                        //html += '   <i class="fa fa-trash-o" aria-hidden="true"> ';
                        //html += '    <div class="wkbf-dele-s"> ';
                        //html += '     <div class="cirle-s-min"></div> ';
                        //html += '    <div class="cirle-i-min"></div> ';
                        //html += '    </div> </i>';
                        //html += '  </div> ';
                        html += '  </div> ';
                        html += ' </div>';
                        $('.wkzc-right-set-content').eq(0).find('.wkzc-right-set-content-div').hide();
                        $('.wkzc-right-set-content').eq(0).find('.wkzc-right-set-msg-content').show().html(html);
                        $(".wkzc-right-content-div > div:eq(0)").click();
                        $('.wkzc-right-main-tit p').removeClass('wkzc-right-main-tit-p').eq(0).addClass('wkzc-right-main-tit-p');
                        ichange(0);
                        removeError();
                        $('.wkzc-right-set-content').eq(0).css({display: 'block',}).siblings().css({display: 'none',});
                    } else {
                        layer.msg(res.msg);
                    }
                }
            });

            break;
        case 'text':
            console.log(menuObj.value);
            layedit.setContent(text_index,htmlspecialchars_decode(menuObj.value));
            // $('.wkzc-right-set-content').eq(1).find('textarea').val(menuObj.value);
            if (/^\[keyword_reply\]/.test(menuObj.value)) {
                $(".wkzc-right-content-div > div:eq(0)").click();
                $('.wkzc-right-main-tit p:eq(4)').click();
                removeError();
                $.each($(".wxcd-key-words-main .wxcd-key-words-main-p2"),function(k,ax){
                    console.log("开始");
                    console.log($(ax));
                    if ($(ax).text() == menuObj.value.replace(/^\[keyword_reply\]/,"")){
                        $(ax).parents("li").click();
                    }
                });
            } else {
                $(".wkzc-right-content-div > div:eq(0)").click();
                $('.wkzc-right-main-tit p').removeClass('wkzc-right-main-tit-p').eq(1).addClass('wkzc-right-main-tit-p');
                ichange(1);
                removeError();
                $('.wkzc-right-set-content').eq(1).css({display: 'block',}).siblings().css({display: 'none',});
            }
            
            // editor_edit();
            break;
        case 'img':
            var html = '<div class="wkzc-img-yulan">';
                html += '<img src="' + menuObj.image_url + '" media_id="' + menuObj.media_id + '" alt="">';
                html += '<div><i class="fa fa-exchange" aria-hidden="true"></i><span>替换素材</span></div>';
                html += '</div>';
            $('.wkzc-right-set-content').eq(2).find('.wkzc-right-set-content-div').hide();
            $('.wkzc-right-set-content').eq(2).find('.wkzc-right-set-msg-content').show().html(html);
            $(".wkzc-right-content-div > div:eq(0)").click();
            $('.wkzc-right-main-tit p').removeClass('wkzc-right-main-tit-p').eq(2).addClass('wkzc-right-main-tit-p');
            ichange(2);
            removeError();
            $('.wkzc-right-set-content').eq(2).css({display: 'block',}).siblings().css({display: 'none',});
            break;
        case 'voice':
            var html = '<div class="voice_div" data-type="voice" data-name="' + menuObj.filename + '" media_id="' + menuObj.media_id + '" data-times="' + menuObj.times + '">';
            html += '<div class="voice_div-yulan"><i class="fa fa-exchange" aria-hidden="true"></i><span>替换素材</span></div>';
            html += '<div class="voice_div_img"><audio src="' + menuObj.url + '" class="player" id="' + menuObj.media_id + '"></audio><img src="http://alstyle.xmyeditor.com/xmyweb/20181206/5c08f9f037266joepdzqjey.kwgbgbbpvzbhveecvziwujwarxtaev" class="img-ser" /></div>';
            html += '<div class="voice_div_right">';
            html += '         <div class="voice_div_title">' + menuObj.filename + '</div>';
            html += '         <div class="voice_div_time">' + menuObj.times + '</div>';
            html += '     </div>';
            html += ' </div>';
            $('.wkzc-right-set-content').eq(3).find('.wkzc-right-set-content-div').hide();
            $('.wkzc-right-set-content').eq(3).find('.wkzc-right-set-msg-content').show().html(html);
            $(".wkzc-right-content-div > div:eq(0)").click();
            $('.wkzc-right-main-tit p').removeClass('wkzc-right-main-tit-p').eq(3).addClass('wkzc-right-main-tit-p');
            ichange(3);
            removeError();
            $('.wkzc-right-set-content').eq(3).css({display: 'block',}).siblings().css({display: 'none',});
            break;
        case 'video':
            var html = '<div class="video_div" data-type="video" data-title="' + menuObj.name + '" data-down_url="' + menuObj.value + '">';
            html += '     <p><b>' + menuObj.name + '</b></p>';
            html += '     <p>17:50</p>';
            html += '     <div class="video_img">';
            html += '         <img src="/static/wxmember/img/video_pause.jpg" alt="" />';
            html += '         <p class="video_time">0:12</p>';
            html += '     </div>';
            html += ' </div>';
            $('.wkzc-right-set-content').eq(4).find('.wkzc-right-set-content-div').hide();
            $('.wkzc-right-set-content').eq(4).find('.wkzc-right-set-msg-content').show().html(html);
            $(".wkzc-right-content-div > div:eq(0)").click();
            $('.wkzc-right-main-tit p').removeClass('wkzc-right-main-tit-p').eq(4).addClass('wkzc-right-main-tit-p');
            $('.wkzc-right-set-content').eq(4).css({display: 'block',}).siblings().css({display: 'none',});
            break;
        case 'view':
            removeError();
            $('.wkzc-right-main-msg-p > input').val(menuObj.url);
            $(".wkzc-right-content-div > div:eq(1)").click();
            break;
        default:
            return false;

    }
      
}
 

 /**
  * 给i标签更换背景图
  */
 function ichange(index) {
    $(".wkzc-right-main-tit p:eq(0) i").css("background-image",'url(http://alstyle.xmyeditor.com/xmy/svg/tuwen-img.svg)');
    $(".wkzc-right-main-tit p:eq(1) i").css("background-image",'url(http://alstyle.xmyeditor.com/xmy/svg/text_1.svg)');
    $(".wkzc-right-main-tit p:eq(2) i").css("background-image",'url(http://alstyle.xmyeditor.com/xmy/svg/img_1.svg)');
    $(".wkzc-right-main-tit p:eq(3) i").css("background-image",'url(http://alstyle.xmyeditor.com/xmy/svg/music_1.svg)');
    switch (index){
        case 0:
            $(".wkzc-right-main-tit p:eq(0) i").css("background-image",'url("http://alstyle.xmyeditor.com/xmy/svg/tuwen_2.svg")');
        break;
        case 1:
            $(".wkzc-right-main-tit p:eq(1) i").css("background-image",'url("http://alstyle.xmyeditor.com/xmy/svg/text_2.svg")');
        break;
        case 2:
            $(".wkzc-right-main-tit p:eq(2) i").css("background-image",'url("http://alstyle.xmyeditor.com/xmy/svg/img_2.svg")');
        break;
        case 3:
            $(".wkzc-right-main-tit p:eq(3) i").css("background-image",'url("http://alstyle.xmyeditor.com/xmy/svg/music_2.svg")');
        break;
    }
 }

//文字框
$(document).on('input', '.wkzc-right-set-position-input textarea', function () {
    var $btn = $(this),
        len = $btn.val().length;
    if (len > 230) {
        $('.wkzc-right-set-position-footer-p p').text('已超出' + (len - 230) + '字').css({color: '#FA5151'});
        return false;
    }
    if ($btn.val().length <= 230 && $btn.val().length >= 0) {
        setDescArray("type", 'text');
        setDescArray("value", $(this).val());
        $('.wkzc-right-set-position-footer-p p').text('还可以输入' + (230 - len) + '字').css({color: '#8d8d8d'});
    }
});


//点击相应从素材库选择，显示相应弹窗
$(document).on("click", '.wkzc-figure-choose', function () {
    console.log('图文弹窗');
    console.log(getDescArray());
    var url = "/member/Wxmessage/imagetext";
    layer.open({
        type: 2,
        title: false,
        closeBtn: 2,   //关闭差号
        masksToBounds: true,
        shade: 0.4,
        move: false,
        area: ['930px', '670px'],
        content: [url, 'no'],
        btn: ['确认', '取消'],
        yes: function (index, layero) {
            //当点击‘确定’按钮的时候，获取弹出层返回的值
            var res = window["layui-layer-iframe" + index].callbackdata();
            console.log(res);
            if (res.text == undefined || res.mid == undefined) {
                layer.msg('请选择图文');
                return false;
            }
            layer.close(index); //如果设定了yes回调，需进行手工关闭
            setDescArray('type', 'news');
            setDescArray('media_id', res.mid);
            setDescArray('murl', res.murl);
            fill_from(getDescArray());
        }
    });
});


//点击图片后弹窗
$(document).on("click", '.wkzc-img-choose', function () {
    var url = "/member/Wxmessage/imglist";
    var obj = $(this).parents(".wkzc-right-set-content-div");
    layer.open({
        type: 2,
        title: false,
        closeBtn: 2,   //关闭差号
        masksToBounds: true,
        shade: 0.4,
        move: false,
        area: ['922px', '670px'],
        content: [url, 'no'],
        btn: ['确认', '取消'],
        yes: function (index, layero) {
            var res = window["layui-layer-iframe" + index].callbackdata();
            console.log(res);
            if (res.mid == undefined || res.mid == '') {
                layer.msg('请选择图片');
                return false;
            }
            //替换图片链接 和 素材ID
            $(obj).hide().next().show().attr("mid", res.mid).find("img").prop("src", res.murl);
            layer.close(index); //如果设定了yes回调，需进行手工关闭
            setDescArray('type', 'img');
            setDescArray('media_id', res.mid);
            setDescArray('image_url', res.image_url);
            fill_from(getDescArray());
        }
    });
});

//触发上传图片事件
$(document).on("click", ".wx_upimage", function () {
    $(this).next().click();
});

// 上传图片
$(document).on("change", ".wx_upimage + input", function (event) {
    var file = $(this)[0].files[0];
    if (file) {
        $('#upload_loading').css('display', 'flex');
    } else {
        return false;
    }
    setTimeout(function () {
        var res = uploadImg(file);
        if (res.code == 1) {
            $('#upload_loading').hide();
            //请空文件
            $(".wx_upimage + input").val("");
            setDescArray('type', 'img');
            setDescArray('media_id', res.data.media_id);
            setDescArray('image_url', res.data.image_url);
            //切换
            fill_from(getDescArray());
        } else {
            $('#upload_loading').hide();
            //请空文件
            $(".wx_upimage + input").val("");
            layer.msg(res.msg);
        }
    }, 100);
});

/**
 * 音频列表选择页面
 */
$(document).on('click', ".wkzc-voice-choose", function () {
    var url = "/member/Wxmessage/voice";
    var obj = $(this).parents(".wkzc-right-set-content-div");
    layer.open({
        type: 2,
        title: false,
        closeBtn: 1,   //关闭差号
        masksToBounds: true,
        shade: 0.4,
        move: false,
        area: ['922px', '670px'],
        content: [url, 'no'],
        btn: ['确认', '取消'],
        yes: function (index, layero) {
            var res = window["layui-layer-iframe" + index].callbackdata();
            console.log(res);
            if (res.mid == undefined || res.mid == '') {
                layer.msg('请选择音频文件');
                return false;
            }
            $(obj).hide().next().attr("mid", res.mid).show().find(".wkzc-cnt-msgCnt-sec-con-msg-li1").html(res.filename);
            $(obj).hide().next().show().find(".wkzc-cnt-msgCnt-sec-con-msg-li3").html(res.day);
            layer.close(index); //如果设定了yes回调，需进行手工关闭
            setDescArray('type', 'voice');
            setDescArray('filename', res.filename);
            setDescArray('media_id', res.mid);
            setDescArray('times', res.times);
            setDescArray('url', res.url);
            fill_from(getDescArray());
        }
    });
});

//触发上传语音
$(document).on("click", ".wkzc-right-music-puton", function () {
    $(this).next().click();
});
//上传语音
$(document).on("change", ".wkzc-right-music-puton + input", function (event) {
    var file = $(this)[0].files[0];
    if (file) {
        $('#upload_loading').css('display', 'flex');
    } else {
        return false;
    }
    setTimeout(function () {
        var res = uploadVoice(file);
        if (res.code == 1) {
            $('#upload_loading').hide();
            //请空文件
            $(".wkzc-right-music-puton + input").val("");
            setDescArray('type', 'voice');
            setDescArray('filename', res.data.filename);
            setDescArray('media_id', res.data.media_id);
            setDescArray('times', res.data.times);
            setDescArray('url', res.data.url);
            fill_from(getDescArray());
        } else {
            $('#upload_loading').hide();
            $(".wkzc-right-music-puton + input").val("");
            layer.msg(res.msg);
        }
    }, 100);
});

// 音乐的点击播放
$(document).on('click', '.img-ser', function () {
    var _this = $(this);
    var src = _this.attr('src');
    var urls = _this.prev().attr('src');
    var mid = _this.prev().attr('id');
    var player = _this.prev()[0]; //jquery对象转换成js对象
    var pause_src = 'http://alstyle.xmyeditor.com/xmyweb/20181206/5c08f9f037266joepdzqjey.kwgbgbbpvzbhveecvziwujwarxtaev';
    var player_src = 'http://alstyle.xmyeditor.com/xmyweb/20181206/5c08f9f014ee9unkbtznvmg.fjmmmyklxokhgqscctfdlsctxxiisr';
    if (src.indexOf('kwgbgbbpvzbhveecvziwujwarxtaev') < 0) {
        _this.attr('src', pause_src);
        player.pause();// 暂停
    } else { // 播放
        // 点击播放时候，让其他的暂停
        _this.attr('src', player_src);
        player.play(); // 播放
        voiceStatistics(urls,mid,0,0);
        // 调用是否播放完毕
        player.loop = false;
        player.addEventListener('ended', function () {
            _this.attr('src', pause_src);
        }, false);
    }
});


//点击视频后弹窗
$(document).on('click', ".wkzc-movie-choose", function () {
    var url = "/member/Wxmessage/video";
    var obj = $(this).parents(".wkzc-right-set-content-div");
    layer.open({
        type: 2,
        title: false,
        closeBtn: 1,   //关闭差号
        masksToBounds: true,
        shade: 0.4,
        move: false,
        area: ['922px', '670px'],
        content: [url, 'no'],
        btn: ['确认', '取消'],
        yes: function (index, layero) {
            var res = window["layui-layer-iframe" + index].callbackdata();
            if (res.mid == undefined || res.mid == '') {
                layer.close(index); //如果设定了yes回调，需进行手工关闭
                return false;
            }
            $(obj).hide().next().show().attr("mid", res.mid).find(".wkzc-content-messageContent-second-tit").html(res.title);
            layer.close(index); //如果设定了yes回调，需进行手工关闭
            setDescArray('type', 'video');
            setDescArray('media_id', res.mid);
            fill_from(getDescArray());
        }
    });
});


//触发上传视频
$(document).on("click", ".wkzc-right-vioce-puton", function () {
    $(this).next().click();
});
//上传视频
$(document).on("change", ".wkzc-right-vioce-puton + input", function (event) {
    var file = $(this)[0].files[0];
    var res = uploadVideo(file);
    if (res.code == 1) {
        //切换
        $(".wkzc-right-vioce-puton + input").val("");
        setDescArray('type', 'video');
        setDescArray('media_id', res.mid);
        fill_from(getDescArray());
    } else {
        $(".wkzc-right-vioce-puton + input").val("");
        layer.msg(res.msg);
    }
});


//添加常用JQ方法
jQuery.fn.outerHTML = function (s) {
    return (s) ? this.before(s).remove() : $("<Hill_man>").append(this.eq(0).clone()).html();
};
//获取字符串长度 ：中文长度为2
String.prototype.getBytes = function () {
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
};

//用来保存数据的全局数组
//增加主菜单
$(document).on("click", ".wkzc-left-add", function () {
    console.log("创建主菜单");
    //校验主菜单数量
    var index = isNaN(parseInt($(".wkzc-left-nav > .wkzc-left-nav-mean:last").data("index")) + 1) ? 0 : parseInt($(".wkzc-left-nav > .wkzc-left-nav-mean:last").data("index")) + 1;
    console.log(index);
    var menu_html = $("#temp_preview .wkzc-left-nav-mean").outerHTML();
    $(".wkzc-left-nav").append(menu_html);
    console.log($(".wkzc-left-nav > .wkzc-left-nav-mean:last"));
    $(".wkzc-left-nav > .wkzc-left-nav-mean:last").attr("data-index",index).find(".wkzc-find-nav").attr("data-index",index);
    //创建对应数组
    createDescArray(index);
    $(".wkzc-left-nav > .wkzc-left-nav-mean:last .wkzc-find-nav").click();
    ichange(0);
    if ($(".wkzc-left-nav .wkzc-left-nav-mean").length >= 3) {
        // layer.msg("最多可创建3个主菜单");
        $(this).hide();
        return false;
    }
});

//增加子菜单
$(document).on("click", ".wkzc-left-nav-add", function () {
    var index = isNaN(parseInt($(this).prev().data("index")) + 1 ) ? 0 : parseInt($(this).prev().data("index")) + 1;
    var menu_html = $("#temp_preview .wkzc-find-nav-copy").outerHTML();
    $(this).before(menu_html);
    $(this).prev().data("index",index);

    var son_index = $(this).prev().data("index"),
        par_index = $(this).parents(".wkzc-left-nav-mean").data("index");
   $(this).prev().attr("data-index",son_index);
    createDescArr(par_index, son_index);
    $(this).prev().click();
    ichange(0);
    //校验子菜单数量
    if ($(this).prevAll().length >= 5) {
        $(this).hide();
    }
});

var temp_remove_obj; //待删除对象
//删除主菜单
$(document).on("click", ".wkzc-left-lord-dele", function (ev) {
    console.log('删除主菜单2')
    if($(this).parent().next().find("li").length > 1){
        var name = $(this).parent().find(".menu_name").html();
        layer.msg("请先删除“"+name+"”主菜单下的子菜单后再操作！");
        return false;
    }
    temp_remove_obj = $(this).parents(".wkzc-left-nav-mean");
    toggleTan(".wkzc-delete-sure", "block");
});

//删除子菜单
$(document).on("click", ".wkzc-left-nav-dele", function () {
    console.log('删除子菜单 ')
    $(this).parents("ul").children("li:last").show();
    temp_remove_obj = $(this).parent();
    toggleTan(".wkzc-delete-sure", "block");
});

//删除确定按钮
$(document).on("click", ".wkzc-delete-sure .wkzc-delete-sure-foot-sure", function () {
    //删除对象，关闭弹窗
    //如果删除的是主菜单
    var index;
    if ($(temp_remove_obj).hasClass("wkzc-find-nav-li")) {
        var par_index = $(temp_remove_obj).parents(".wkzc-left-nav-mean").data("index");
        index = $(temp_remove_obj).data("index");
        delete descArray[par_index].sub_button[index];
        // descArray[par_index].sub_button.length = descArray[par_index].sub_button.length - 1;
        // descArray[par_index].sub_button.splice(index,1);
    } else {
        index = temp_remove_obj.data("index");
        delete descArray[index];
        // descArray.length = descArray.length - 1;
        // descArray.splice(index,1);
    }
    $(temp_remove_obj).remove();
    if ($(".wkzc-left-nav .wkzc-left-nav-mean").length < 3) {
    $(".wkzc-left-add").show();
    }
    toggleTan(".wkzc-delete-sure", "none");
    //点击第一个菜单
    if ($('.wkzc-find-nav').length > 1) {
        $('.wkzc-find-nav').eq(0).click();
    }else{
        $(".wkzc-right-much,.wkzc-right-mean").css("display","none");
    }

});

//取消删除按钮
$(document).on("click", ".wkzc-delete-sure-foot-cancel,.wkzc-delete-sure-i", function () {
    //释放变量，关闭弹窗
    temp_remove_obj = null;
    toggleTan(".wkzc-delete-sure", "none");
});

/*
 * 生成主菜单数据
 * @param index 当前菜单所属的index
 * */
function createDescArray(index) {
    descArray[index] = {};
    descArray[index].name = "主菜单";
    descArray[index].sub_button = [];
}

/**
 * 生成子菜单数据
 * @param index 当前菜单所属的index
 * */
function createDescArr(par_index, index) {
    descArray[par_index].sub_button[index] = {};
    descArray[par_index].sub_button[index].name = "子菜单";
}


/*
 * 获取菜单数据
 * */
function getDescArray() {
    console.log(111222333);
    var index;
    if ($(".wkzc-left-nav-addli").hasClass("wkzc-find-nav")) {
        // index = $(".wkzc-left-nav-addli").parents(".wkzc-left-nav-mean").index();
        index = $(".wkzc-left-nav-addli").data("index");
        descArray[index].index = index;
        return descArray[index];
    } else {
        // var par_index = $(".wkzc-left-nav-addli").parents(".wkzc-left-nav-mean").index();
        var par_index = $(".wkzc-left-nav-addli").parents(".wkzc-left-nav-mean").data("index");
        // index = $(".wkzc-left-nav-addli").index();
        index = $(".wkzc-left-nav-addli").attr("data-index");
        console.log("断点测试1");
        console.log(index);
        console.log($(".wkzc-left-nav-addli"));
        descArray[par_index].sub_button[index].index = index;
        return descArray[par_index].sub_button[index]
    }
}

/**
 * 更新数组数据
 * */
function setDescArray(key, value) {
    var index;
    if ($(".wkzc-left-nav-addli").hasClass("wkzc-find-nav")) {
        // index = $(".wkzc-left-nav-addli").parents(".wkzc-left-nav-mean").index();
        index = $(".wkzc-left-nav-addli").data("index");
        descArray[index][key] = value;
    } else {
        var par_index = $(".wkzc-left-nav-addli").parents(".wkzc-left-nav-mean").data("index");
        // index = $(".wkzc-left-nav-addli").index();
         index = $(".wkzc-left-nav-addli").data("index");
        descArray[par_index].sub_button[index][key] = value;
    }
    console.log(descArray);
    console.log('类型变化');
}
/**
* 删除数组数据
*/
function delDescArray(key){
     var index;
    if ($(".wkzc-left-nav-addli").hasClass("wkzc-find-nav")) {
        // index = $(".wkzc-left-nav-addli").parents(".wkzc-left-nav-mean").index();
        index = $(".wkzc-left-nav-addli").data("index");
        if(delete descArray[index][key] != undefined){
            delete descArray[index][key];
        }
    } else {
        var par_index = $(".wkzc-left-nav-addli").parents(".wkzc-left-nav-mean").data("index");
        // index = $(".wkzc-left-nav-addli").index();
        index = $(".wkzc-left-nav-addli").data("index");
        if(descArray[par_index].sub_button[index][key] != undefined){
            delete descArray[par_index].sub_button[index][key];
        }
    }
    console.log(descArray);
    console.log('类型变化');
}

//控制页面弹窗
function toggleTan(className, toggle) {
    $(".wkzc-hide," + className).css("display", toggle);
}
// 点击自定义菜单展开选项并添加背景色
var dbl_click_status = 0;
$(function () {
    // 点击导航栏添加样式
    $(document).on("click", '.wkzc-find-nav', function () {
        console.log("点击主菜单");
        var $btn = $(this);
        var $btnNextLength = $btn.next().find('li').length;
        console.log("主菜单有" + $btnNextLength + "子菜单");
        $(".wkzc-left-nav-addli").removeClass('wkzc-left-nav-addli');
        $btn.addClass('wkzc-left-nav-addli');
        $(".wkzc-delete-sure-spancenter").html($(".wkzc-left-nav-addli").find(".menu_name").html());
        var index = $(this).parent().data("index");
        // 将数组中的数据赋值到右侧详情页面
        var temp_arr = getDescArray();
        if ($btnNextLength <= 1) {
            fill_from(temp_arr);
            $(".wkzc-right-mean .wkzc-right-name span").html("主菜单字数不超过5个汉字或10个字母");
            $('.wkzc-right-mean').hide();
            $('.wkzc-right-much').show();
        } else {
            //名称
            if (temp_arr['name'] != undefined) {
                $(".wkzc-right-mean .wkzc-right-name input").val(temp_arr['name']);
            } else {
                $(".wkzc-right-mean .wkzc-right-name input").val("");
            }
            $(".wkzc-right-much .wkzc-right-name span").html("主菜单字数不超过5个汉字或10个字母");
            $('.wkzc-right-mean').show();
            $('.wkzc-right-much').hide();
        }
    });

    //菜单双击时显示输入框，输入信息，之后将输入的信息显示出来
    $(document).on("dblclick", '.wkzc-find-nav,.wkzc-find-nav-li', function (e) {
        var $btn = $(this);
        var $btnInput = $btn.find('input');
        var $btnP = $btn.find('p:eq(0)');
        var $btnSpan = $btnP.find('span:eq(0)');
        $btnP.css({
            display: 'none',
        });
        $btnInput.css({
            display: 'block',
        });
        //获取鼠标位置并将提示内内容显示在相应位置。
        if(dbl_click_status == 0){
            var offset = $btn.offset();
            var $X = offset.left;
            var $Y = offset.top - 40;
            $('.wkzc-number').css({
                top: $Y + 'px',
                left: $X + 'px',
            });
            $('.wkzc-number').fadeIn().delay(1500).fadeOut();
        }
        dbl_click_status = 1;
        setTimeout(function () {
            dbl_click_status = 0;
        },1500);
        //输入框获取焦点
        $btnInput.focus();
        $btnInput.one('blur', function () {
            var $text = $(this).val();
            $text = $text.replace(/[^\d]/g, "");
            if ($text.length > 3) {
                save_keep_status = 1;
                $btn.dblclick();
                layer.msg("序号最大支持三位数");
                return false;
            }
            save_keep_status = 0;
            $(this).val($text);
            $btnSpan.find("span").text($text);
            setDescArray("sort", $text);
            $(this).css({
                display: "none",
            });
            $btnP.css({
                display: 'block',
            });
        });
    });


    //点击子菜单添加样式并显示主体内容
    $(document).on("click", '.wkzc-find-nav-li', function (event) {
        console.log("点击子菜单");
        $(".wkzc-left-nav-addli").removeClass('wkzc-left-nav-addli');
        $(this).addClass('wkzc-left-nav-addli');
        $(".wkzc-delete-sure-spancenter").html($(".wkzc-left-nav-addli").find(".menu_name").html());
        // 将数组中的数据赋值到右侧详情页面
        var temp_arr = getDescArray();
        fill_from(temp_arr);
        $(".wkzc-right-much .wkzc-right-name span").css("color","#999").html("子菜单字数不超过20个汉字或40个字母");
        $('.wkzc-right-mean').hide();
        $('.wkzc-right-much').show();
        return false;
    });


    // 点点击菜单内容中的导航切换内容
    $(document).on("click", ".wkzc-right-content-div div", function () {
        console.log('点击切换菜单内容');
        var index = $(".wkzc-right-content-div div").index(this);
        var temp_array = ['media_id', 'view', 'miniprogram'];
        $(this).find("i").show();
        $(this).siblings().find("i").hide();
        $(this).find("span").addClass('wkzc-right-content-span');
        $(this).siblings().find("span").removeClass('wkzc-right-content-span');
        $('.wkzc-right-main').eq(index).show().siblings().hide();
    });

    //点击菜单后的垃圾桶显示删除弹窗，点击伤处弹窗确定后删除菜单并显示提示文字
    $('.wkzc-left-nav-dele2 i').click(function () {
        console.log('点击子菜单删除')
        var $btn = $(this);
        var $btnFa = $btn.parents('.wkzc-find-nav-li');
        var $btnGa = $btn.parents('.wkzc-left-nav-mean');
        var $btnFaBroAdd = $btnFa.parents('.wkzc-find-nav-ul').find('.wkzc-left-nav-add');
        var $btnFaLg = $btnFa.parents('.wkzc-find-nav-ul').find('.wkzc-find-nav-li').length;
        $('.wkzc-delete-sure-spancenter').text($btnFa.find('p').text());
        $('.wkzc-delete-end').find('span').text($btnFa.find('p').text());
        $('.wkzc-delete-sure').fadeIn();
        $('.wkzc-hide').fadeIn();
        if ($btnFaLg <= 7 && $btnFaLg >= 1) {
            $btnFaBroAdd.css({
                display: 'block',
            });
        } else {
            $btnFaBroAdd.css({
                display: 'none',
            });
        }

        //删除节点的同时删除预览中的节点
        $('.wkzc-delete-sure-foot-sure').one('click', function () {
            $('.wkzc-delete-sure').fadeOut();
            $('.wkzc-hide').fadeOut();
            if ($('.wkzc-left-nav-mean').length == 2) {
                $('.wkzc-preview-tit-one-mean-ul').find('li').eq($btnFa.index()).remove();
            } else if ($('.wkzc-left-nav-mean').length == 3) {
                $('.wkzc-preview-tit-two-mean-ul').eq($btnGa.index() - 1).find('li').eq($btnFa.index()).remove();
            } else if ($('.wkzc-left-nav-mean').length == 4) {
                $('.wkzc-preview-tit-three-mean-ul').eq($btnGa.index() - 1).find('li').eq($btnFa.index()).remove();
            }
            $btnFa.remove();
            $('.wkzc-delete-end').fadeIn().delay(2000).fadeOut();
        });
        //return false;
    });


    $('.wkzc-delete-sure-foot-cancel').click(function () {
        $('.wkzc-delete-sure').fadeOut();
        $('.wkzc-hide').fadeOut();
    });

    $('.wkzc-delete-sure-i').click(function () {
        $('.wkzc-delete-sure').fadeOut();
        $('.wkzc-hide').fadeOut();
    });


    //点击主菜单后的垃圾桶删除主菜单

    $('.wkzc-left-lord-dele2 i').click(function () {
        console.log('点击主菜单删除')
        if($(this).parent().parent().next().find("li").length > 1){
            var name = $(this).parent().parent().find(".menu_name").html();
            layer.msg("请先删除“"+name+"”主菜单下的子菜单后再操作！");
            return false;
        }
        var $btn = $(this);
        var $btnFa = $btn.parents('.wkzc-find-nav');
        var $btnGa = $btn.parents('.wkzc-left-nav-mean');
        $('.wkzc-delete-sure-spancenter').text($btnFa.find('p').text());
        $('.wkzc-delete-end').find('span').text($btnFa.find('p').text());
        $('.wkzc-delete-sure').fadeIn();
        $('.wkzc-hide').fadeIn();
        $('.wkzc-delete-sure-foot-sure').one('click', function () {
            $('.wkzc-delete-sure').fadeOut();
            $('.wkzc-hide').fadeOut();
            $btnGa.remove();
            $('.wkzc-delete-end').fadeIn().delay(2000).fadeOut();

            if ($('.wkzc-left-nav-mean').length < 2) {
                $('.wkzc-right-much').css({
                    display: 'none',
                })
            }
            ;
        });
        return false;
    });


    // 点击图文消息等添加样式并切换内容
    $(document).on("click", ".wkzc-right-main-tit p", function () {
        console.log('点击切换类型');
        var index = $(".wkzc-right-main-tit p").index(this);
        $('.wkzc-right-main-tit p').removeClass('wkzc-right-main-tit-p');
        $(this).addClass('wkzc-right-main-tit-p');
        $('.wkzc-right-set-content').eq(index).css({display: 'block',}).siblings().css({display: 'none',});
        ichange($(this).index());
    });

    // 点击具体选项添加阴影样式
    $('.wkzc-right-set-submenu').each(function () {
        var $btn = $(this);
        $btn.mouseenter(function () {
            var index = $(this).index();
            $(this).css({
                background: '#f9f9f9',
            });
        });
        $btn.mouseleave(function () {
            var index = $(this).index();
            $(this).css({
                background: '',
            });
        });
    });

    //鼠标悬浮选中内容后阴影显示再其上层显示操作选项。
    $('.wkzc-cnt-msgCnt-sec-con').mouseenter(function () {
        var $btn = $(this);
        $btn.find('.wkzc-cnt-msgCnt-sec-con-hide').stop().animate({
            opacity: '1',
        }).css({
            display: 'block',
        });
    });
    //鼠标悬浮移除后内容后阴影、操作选项隐藏
    $('.wkzc-cnt-msgCnt-sec-con').mouseleave(function () {
        var $btn = $(this);
        $btn.find('.wkzc-cnt-msgCnt-sec-con-hide').stop().animate({
            opacity: '0',
        });
    });


    //点击更换符号重新选择相应内容
    $('.wkzc-cnt-msgCnt-sec-con-hide-fir i').click(function () {
        var $btn = $(this);
        var $btnFa = $btn.parents('.wkzc-right-set-content');
        // var $btnFa = $btn.parents('.wkzc-right-set-msg-content');
        if ($btnFa.index() === 0) {
            $(".wkzc-figure-choose").click();
            // $btnFa.css({
            // 	display:'none',
            // });是11
            // $('.wkzc-figure').fadeIn();
            // $('.wkzc-hide').fadeIn();
            // $('.pop-img-zd').css({
            // 	display:'none',
            // });
        } else if ($btnFa.index() === 1) {
            $(".wkzc-img-choose").click();
            // $btnFa.css({
            // 	display:'none',
            // });
            // $('.wkzc-img').fadeIn();
            // $('.wkzc-hide').fadeIn();
            // $('.pop-img-zd').css({
            // 	display:'none',
            // });
        } else if ($btnFa.index() === 2) {
            $(".wkzc-voice-choose").click();
            // $btnFa.css({
            // 	display:'none',
            // });
            // $('.wkzc-voice').fadeIn();
            // $('.wkzc-hide').fadeIn();
        } else if ($btnFa.index() === 3) {
            $(".wkzc-movie-choose").click();
            // $btnFa.css({
            // 	display:'none',
            // });
            // $('.wkzc-video-one').fadeIn();
            // $('.wkzc-hide').fadeIn();
            // $('.pop-img-zd').css({
            // 	display:'none',
            // });
        }

    });

    //选中图文信息中的垃圾符号删除相应页面并返回原页面。
    $('.wkzc-cnt-msgCnt-sec-con-hide-sec i').click(function () {
        $(this).parents('.wkzc-right-set-msg-content').hide();
        $btnFa.prev().show();
    });


    //菜单名称输入框提示信息信息
    $(document).on('focus', '.wkzc-right-name input', function () {
        if($(".wkzc-left-nav-addli").hasClass('wkzc-find-nav')){
            $('.wkzc-right-name span').text("主菜单字数不超过5个汉字或10个字母");
        }else{
            $('.wkzc-right-name span').text("子菜单字数不超过20个汉字或40个字母");
        }
    });
    //菜单名称输入框输入后验证信息
    $(document).on('input', '.wkzc-right-mean .wkzc-right-name input,.wkzc-right-much .wkzc-right-name input', function () {
        $(this).next().css({
            color: '#999',
        });
        if ($(this).val() == '') {
            $(this).next().text("菜单名称不能为空").css({
                color: '#e15f63',
            });
            return false;
        }

        var len = 10;
        if($(".wkzc-left-nav-addli").hasClass("wkzc-find-nav-li")){
            len = 40;
        }
        //校验菜单名称长度
        if ($(this).val().getBytes() > len) {

        if($(".wkzc-left-nav-addli").hasClass('wkzc-find-nav')){
            $(this).next().text("主菜单字数不超过5个汉字或10个字母").css({
                color: '#e15f63',
            });
        }else{
             $(this).next().text("子菜单字数不超过20个汉字或40个字母").css({
                color: '#e15f63',
            });
        }
            return false;
        }

        $(this).next().html('<i class="fa fa-check"></i>');
        $(this).next().css({
            color: '#95d46a',
        });
    });
    var input_state = 0;
    //菜单名称
    $(document).on('input', '.wkzc-right-name input', function () {
        
        // if(input_state != 0){
        //     setTimeout(function(){
        //         input_state = 0;
        //     },20);
        //     return false;
        // }
        // input_state = 1;
        var val = "菜单";
        if ($(this).val() != "") {
            val = $(this).val();
        }
        setDescArray("name", val);
        $(".wkzc-left-nav-addli p  .menu_name").html(val);
    });

    var save_keep_status = 0;
    //保存事件
    $(document).on("click", ".wxzc-content-foot-keep", function () {
        if(save_keep_status === 1){
            return false;
        }
        var _data = {
            content: JSON.stringify(descArray)
        };
        var len_state = 0;
        var states = 0;
        console.log(descArray);
        $.each(descArray,function(k,val){
                if(val == undefined) return false;
                if(len_state == 1 || len_state == 2 || val.name.getBytes() > 10){
                    len_state = 2;
                    return false;
                }
                var s_state = 0;
                if (arrayCount(val.sub_button) > 0) {
                    s_state = 1;
                }else if (arrayCount(val.sub_button) == 0 && (val == undefined || !val.hasOwnProperty('type'))) {
                    s_state = 1;
                }
            $.each(val.sub_button,function(index,item){
                if (item != undefined) {
                    s_state = 0;
                }
                if(item == undefined){
                    return true;
                }
                if(!item.hasOwnProperty('type') ){
                    $(".wkzc-find-nav[data-index="+ k +"]").parent().find(".wkzc-find-nav-li[data-index="+ index +"]").click();
                    states = 1;
                    s_state = 0;
                }
                if(item == undefined || item.name == undefined) return false;
                if(len_state == 1 || len_state == 2 || item.name.getBytes() > 40){
                    len_state = 1;
                    return false;
                }
            });
             if(s_state == 1){
                $(".wkzc-find-nav[data-index="+ k +"]").click();
                states = 1;
            }
        });

        if(states == 1){
            $(".wkzc-right-main").addClass("error");
            $(".menu-none-tips").show();
            return false;
        }
        if(len_state == 1){
            layer.msg("子菜单字数不超过20个汉字或40个字母");
            return false;
        }
        if(len_state == 2){
            layer.msg("主菜单字数不超过5个汉字或10个字母");
            return false;
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            traditional: true,
            url: "/member/Wxmenu/addInfo",
            data: _data,
            success: function (res) {
                if (res.code == 1) {
                    layer.msg('保存成功');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    });

    //发布弹窗
    $('.wkzc-left-view-p1').click(function () {
        if(save_keep_status == 1){
            return false;
        }
        var len_state = 0;
        var states = 0;
        $.each(descArray,function(k,val){
                if(val == undefined) return false;
                if(len_state == 1 || len_state == 2 || val.name.getBytes() > 10){
                    len_state = 2;
                    return false;
                }
                var s_state = 0;
                if (arrayCount(val.sub_button) > 0) {
                    s_state = 1;
                }else if (arrayCount(val.sub_button) == 0 && (val == undefined || !val.hasOwnProperty('type'))) {
                    s_state = 1;
                }
            $.each(val.sub_button,function(index,item){
                if (item != undefined) {
                    s_state = 0;
                }
                if(item == undefined){
                    return true;
                }
                if(!item.hasOwnProperty('type') ){
                    $(".wkzc-find-nav[data-index="+ k +"]").parent().find(".wkzc-find-nav-li[data-index="+ index +"]").click();
                    states = 1;
                    s_state = 0;
                }
                if(item == undefined  || item.name == undefined) return false;
                if(len_state == 1 || len_state == 2 || (item.name != undefined && item.name!='' && item.name.getBytes() > 40)){
                    len_state = 1;
                    return false;
                }
            });
            if(s_state == 1){
                $(".wkzc-find-nav[data-index="+ k +"]").click();
                states = 1;
            }
        });
        if(states == 1){
            $(".wkzc-right-main").addClass("error");
            $(".menu-none-tips").show();
            return false;
        }
        if(len_state == 1){
            layer.msg("子菜单字数不超过20个汉字或40个字母");
            return false;
        }
        if(len_state == 2){
            layer.msg("主菜单字数不超过5个汉字或10个字母");
            return false;
        }

            // 40 20
    // 10   5
        console.log('提交数据');
        //判断文字长度，不能超过230个字
        for (var i in descArray) {
            if (descArray[i].hasOwnProperty('type')) {
                if (descArray[i].type == 'text' && descArray[i].value.length > 230) {
                    layer.msg('文本长度不能大于230');
                    return false;
                }
            } else {
                for (var j in descArray[i].sub_button) {
                    console.log(descArray[i].sub_button[j]);
                    if (descArray[i].sub_button[j].type == 'text' && descArray[i].sub_button[j].value.length > 230) {
                        layer.msg('文本长度不能大于230');
                        return false;
                    }
                }
            }
        }

        $(".confirm-release-bg").show();
    });

    //发布确认 
    $(".confirm-release-foot1").click(function(){
        var _data = {
            content: JSON.stringify(descArray)
        };
        console.log(descArray);
        $(".confirm-release-bg").hide();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "/member/Wxmenu/createMenu",
            data: _data,
            success: function (res) {
                if (res.code == 1) {
                    console.log(res);
                    layer.msg('发布成功');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    });
    //发布取消
     $(".confirm-release-foot2").click(function(){
       $(".confirm-release-bg").hide();
    });

    $('.wkzc-puton').click(function () {
        $('.wkzc-puton-sure').fadeOut();
        $('.wkzc-hide').fadeOut().delay(500);
        $('.wkzc-puton-end').fadeIn().delay(1000).fadeOut();
    });

    $('.wkzc-puton-sure-i').click(function () {
        $('.wkzc-puton-sure').fadeOut();
        $('.wkzc-hide').fadeOut();
    });

    $('.wkzc-puton-sure-foot-cancel').click(function () {
        $('.wkzc-puton-sure').fadeOut();
        $('.wkzc-hide').fadeOut();

    });
    

    //统计数组长度
    function arrayCount(o) {
        var t = typeof o;
        if (t == 'string') {
            return o.length;

        } else if (t == 'object') {
            var n = 0;
            for (var i in o) {
                n++;
            }
            return n;
        }
        return false;
    }

    // 预览弹窗,遍历数据，生成HTML
    $('.wkzc-left-view-p2').click(function () {
        $(".wkzc-phone-main-body").html("");
        $(".wkzc-phone-bg").show();
        $(".wkzc-phone-main-bottom ul").html("");
        $.each(descArray, function (k, v) {
            if(v == undefined){
                return true;
            }
            var class_name = "wkzc-phone-main-li" + arrayCount(descArray);
            var str = '';
            if (v['sub_button'].length != 0) {
                str += '<li class="' + class_name + '" data-index="' + k + '">\n' +
                    '                        <p class="wkzc-phone-list-text"><i class="fa fa-bars" aria-hidden="true"></i><span>' + emoji2img(v['name']) + '</span></p>\n' +
                    '                        <div class="wkzc-phone-list">\n' +
                    '                            <div class="wkzc-phone-list-body">\n' +
                    '                                <span></span>';
                $.each(v['sub_button'], function (key, val) {
                    if(val == undefined){
                        return true;
                    }
                    str += '<p data-index="' + key + '">' + emoji2img(val['name']) + '</p>';
                });
                str += '</div></div></li>';
            } else {
                str += '<li class="' + class_name + '" data-index="'+ k +'"><p class="wkzc-phone-list-text"><i class="fa fa-bars" aria-hidden="true"></i><span>' + emoji2img(v['name']) + '</span></p></li>';
            }
            $(".wkzc-phone-main-bottom ul").append(str);
        })
    });


    //关闭预览窗口
    $('.wkzc-preview-div-off').click(function () {
        $('.wkzc-preview').fadeOut();
        $('.wkzc-hide').fadeOut();
        $('.wkzc-preview-tit-one-mean-ul').find('li').remove();
        $('.wkzc-preview-tit-one-mean-ul').html('<li class="wkzc-preview-tit-one-mean-li wkzc-preview-tit-one-mean-li-capy"></li>');
        $('.wkzc-preview-tit-two-mean-ul').find('li').remove();
        $('.wkzc-preview-tit-two-mean-ul').html('<li class="wkzc-preview-tit-two-mean-li wkzc-preview-tit-two-mean-li-capy"></li>');
        $('.wkzc-preview-tit-three-mean-ul').find('li').remove();
        $('.wkzc-preview-tit-three-mean-ul').html('<li class="wkzc-preview-tit-three-mean-li wkzc-preview-tit-three-mean-li-capy"></li>');
    });


    // 点击视频预览时预览视频
    $('.wkzc-video-play').click(function () {
        $('.wkzc-video').fadeIn();
        $('.wkzc-video').css({
            display: 'block',
        });
        $('.wkzc-hide').fadeOut();
        $('.wkzc-hide').css({
            display: 'block',
        });
    });

    // 点击退出预览返回原页面
    $('.wkzc-video-div-off').click(function () {
        $('.wkzc-video').fadeOut();
        $('.wkzc-hide').fadeOut();
    });

    //点击转载文章选项显示转载弹窗
    $('.wkzc-text-choose').click(function () {
        $('.wkzc-text').fadeIn();
        $('.wkzc-hide').fadeIn();
    });
    //转载文章是输入框验证
    $('.wkzc-text-sure-content-right-border input').keydown(function () {
        var $btn = $(this);
        if ($btn.val() != '') {
            $('.wkzc-text-sure-content-right-i-clolse').removeClass('none');
        }
        ;
    });
    $('.wkzc-text-sure-content-right-border input').focus(function () {
        var $btn = $(this);
        if ($btn.val() == '') {
            $('.wkzc-text-sure-content-right-i-clolse').addClass('none');
        }
        ;
    });
    //转载文章是输入框显示删除
    $('.wkzc-text-sure-content-right-i-clolse').mouseenter(function () {
        var $btn = $(this);
        $btn.css({
            color: '#666',
        });
    });
    $('.wkzc-text-sure-content-right-i-clolse').mouseleave(function () {
        var $btn = $(this);
        $btn.css({
            color: '#ddd',
        });
    });
    //鼠标移入转载文章时搜索是变色
    $('.wkzc-text-sure-content-right-i-search').mouseenter(function () {
        var $btn = $(this);
        $btn.css({
            color: '#666',
        });
    });

    $('.wkzc-text-sure-content-right-i-search').mouseleave(function () {
        var $btn = $(this);
        $btn.css({
            color: '#ddd',
        });
    });
    //转载文章是输入框点击删除清空该输入框
    $('.wkzc-text-sure-content-right-i-clolse').click(function () {
        $('.wkzc-text-sure-content-right-border input').val("").focus();
    });


    //点击相应选项关闭转载弹窗
    $('.wkzc-text-sure-i,.wkzc-text-sure-foot-cancel').click(function () {
        $('.wkzc-text').fadeOut();
        $('.wkzc-hide').fadeOut();
    });


    //确认发布
    $(document).on("click", '.wkzc-text-sure-foot-sure', function () {
        // 将菜单数据发送给后台接口
        var url = '/';
        var data = {"arr": descArray};
        $.post(url, data, function (con) {
            // 处理后台返回数据

        }, "json");

    });

    //页面地址input事件
    $(document).on("input", ".wkzc-right-main-msg-p input", function () {
        var val = $(this).val();
        console.log($(this).val());
        if (val.indexOf("http") === -1) {
            $(this).css("border-color", "#f00");
        } else {
            $(".wkzc-left-nav-addli").attr("data-html",val);
            $(".wkzc-left-nav-addli").attr("data-type","view");
            setDescArray("url", val);
            setDescArray("type", "view");
            $(this).css("border-color", "#ccc");
        }
    });

    //点击从公众号图文中选择的显示弹窗
    $('.wkzc-right-main-msg-p p').click(function () {
        var _this = $(this);
        console.log('从公众号图文消息中选择');
        var url = "/member/Wxmessage/imagetext";
        layer.open({
            type: 2,
            title: false,
            closeBtn: 2,   //关闭差号
            masksToBounds: true,
            shade: 0.4,
            move: false,
            area: ['930px', '670px'],
            content: [url, 'no'],
            btn: ['确认', '取消'],
            yes: function (index, layero) {
                //当点击‘确定’按钮的时候，获取弹出层返回的值
                var res = window["layui-layer-iframe" + index].callbackdata();
                console.log(res);
                if (res.text == undefined) {
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    return false;
                }
                //写入到文本框中
                _this.prev('input').val(res.murl);
                setDescArray('type', 'view');
                setDescArray('media_id', res.mid);
                setDescArray('url', res.murl);
                $(".wkzc-left-nav-addli").attr("data-html",res.murl);
                $(".wkzc-left-nav-addli").attr("data-type","url");
                $(".wkzc-right-set-content-imagetext").hide();
                removeError();
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });
    });
    //跳转网页下从公众号图文消息中选择弹窗点击相应选项进行跳转
    $('.wkzc-link-text-navs-ul li').each(function () {
        var $btn = $(this);
        var index = $btn.index();
        $btn.click(function () {
            $btn.siblings().removeClass('wkzc-link-text-navs-ul-li-color');
            $btn.addClass('wkzc-link-text-navs-ul-li-color');
            $('.wkzc-link-text-content').eq(index).css({
                display: 'block',
            }).siblings().css({
                display: 'none',
            });
        });
    });

    //只能选中一个类别，并且在选中好底部保存按钮进行变化并可以被选中
    $('.wkzc-link-tboby-td').each(function () {
        var $btn = $(this);
        var $btnGaChild = $btn.parents('.wkzc-link-text-content').find('.wkzc-link-sure-first');
        $btn.click(function () {
            $('.wkzc-link-tboby').find('i').removeClass('wkzc-link-tboby-showi')
            $(this).find('i').addClass('wkzc-link-tboby-showi');
            $btnGaChild.css({
                cursor: 'pointer',
                border: '1px solid #44B549',
                color: '#fff',
                background: '#44B549',
            });
        });
    });

    //菜单内容点击事件
    $('.wkzc-link-figure-content b').each(function () {
        var $btn = $(this);
        var $btnGaChild = $btn.parents('.wkzc-link-text-content').find('.wkzc-link-sure-first');
        $btn.click(function () {
            $('.wkzc-link-figure-content b').find('i').removeClass('wkzc-link-tboby-showi')
            $(this).find('i').addClass('wkzc-link-tboby-showi');
            $btnGaChild.css({
                cursor: 'pointer',
                border: '1px solid #44B549',
                color: '#fff',
                background: '#44B549',
            });
        });
    });

    // 选择图文消息中历史消息部分
    $('.wkzc-link-footer-input div').click(function () {
        var $btn = $(this);
        var $btnChild = $btn.find('i');
        var $btnGaChild = $btn.parents('.wkzc-link-text-content').find('.wkzc-link-sure-first');
        if ($btnChild.css('opacity') == '0') {
            $btnChild.css({
                opacity: '1',
            });
            $btnGaChild.css({
                cursor: 'pointer',
                border: '1px solid #44B549',
                color: '#fff',
                background: '#44B549',
            });
        } else {
            $btnChild.css({
                opacity: '0',
            });
            $btnGaChild.css({
                border: '1px solid #dedede',
                color: '#a5a6aa',
                background: '#E7E7EB',
                cursor: 'default',
            });
        }
    });

    //点击叉号和取消按钮关闭该弹窗
    $('.wkzc-link-text-tit i').click(function () {
        $('.wkzc-link-text').fadeOut();
        $('.wkzc-hide').fadeOut();
    });

    $('.wkzc-link-sure-second').click(function () {
        $('.wkzc-link-text').fadeOut();
        $('.wkzc-hide').fadeOut();
    });


    //点击确定按钮的一系列事件
    $('.wkzc-link-sure-first').click(function () {
        var $btn = $(this);
        if ($btn.css('backgroundColor') == 'rgb(68, 181, 73)') {
            if ($('.wkzc-link-text-content').eq(0).css('display') == 'block') {
                $('.wkzc-right-li-text').text($('.wkzc-link-text-navs-ul li').eq(0).text());
            } else if ($('.wkzc-link-text-content').eq(1).css('display') == 'block') {
                $('.wkzc-right-li-text').text($('.wkzc-link-text-navs-ul li').eq(1).text());
            } else if ($('.wkzc-link-text-content').eq(2).css('display') == 'block') {
                $('.wkzc-right-li-text').text($('.wkzc-link-text-navs-ul li').eq(2).text());
            } else {
                $('.wkzc-right-li-text').text($('.wkzc-link-text-navs-ul li').eq(3).text());
            }
            $('.wkzc-link-text').fadeOut();
            $('.wkzc-hide').fadeOut();
            $('.wkzc-right-main-msg-p p').css({
                display: 'none',
            });
            $('.wkzc-right-main-msg-end').css({
                display: 'block',
            });
            $('.wkzc-right-main-msg-p div').text('https://mmbiz.qlogo.cn/mmbiz_gif/Ljib4So7yuWiaVA86bibY6vDGQfomQHfJ9BgYRLpHOw0RpF6xvkF3H28tWp8FGFIYTQq1TrZNSDVogmIPzFNDEIWA/640?wx_fmt=gif');
        } else {
            return false;
        }
        ;
    });

    //点击重新选择
    $('.wkzc-right-main-msg-end div').click(function () {
        $('.wkzc-link-text').fadeIn();
        $('.wkzc-hide').fadeIn();
    });


    //页面模板点击添加样式
    $('.wkzc-link-list-content-left').click(function () {
        var $btn = $(this);
        var $btnChild = $btn.find('.wkzc-link-list-content-left-mask');
        var $btnFooter = $('.wkzc-link-list-content-content').find('.wkzc-link-list-content-left-mask');
        var $btnGaChild = $btn.parents('.wkzc-link-text-content').find('.wkzc-link-sure-first');
        $btnFooter.css({
            display: 'none',
        });
        $btnChild.css({
            display: 'block',
        });
        $btnGaChild.css({
            cursor: 'pointer',
            border: '1px solid #44B549',
            color: '#fff',
            background: '#44B549',
        });
    });


    $('.wkzc-link-list-content-right').click(function () {
        var $btn = $(this);
        var $btnChild = $btn.find('.wkzc-link-list-content-left-mask');
        var $btnFooter = $('.wkzc-link-list-content-content').find('.wkzc-link-list-content-left-mask');
        var $btnGaChild = $btn.parents('.wkzc-link-text-content').find('.wkzc-link-sure-first');
        $btnFooter.css({
            display: 'none',
        });
        $btnChild.css({
            display: 'block',
        });
        $btnGaChild.css({
            cursor: 'pointer',
            border: '1px solid #44B549',
            color: '#fff',
            background: '#44B549',
        });
    });

});

/**
 *  图文消息删除
 * */
$(document).on('click','.wkbf-deleat',function () {
    var _this = $(this);
    _this.parents('.wkzc-right-set-msg-content').css('display','none');
    _this.parents('.wkzc-right-set-msg-content').prev('.wkzc-right-set-content-div').css('display','block');
    _this.parents('.wkbf-ft').remove();
    delDescArray("type");
    delDescArray("murl");
    delDescArray("media_id");
});
/**
 *  替换图片
 * */
$(document).on('click','.wkzc-img-yulan>div',function () {
    $(".wkzc-img-choose").click();
});
/**
 *  替换音乐
 * */
$(document).on('click','.voice_div-yulan',function () {
    $(".wkzc-voice-choose").click();
});



//预览弹窗，主菜单按钮单击事件
$(document).on("click",".wkzc-phone-list-text",function(){
    var len =  $(this).parent().find(".wkzc-phone-list-body > p").length;
    //如果含有子菜单 return false
    if(len > 0){
        return false;
    }
    var index =  $(this).parent().data("index");
    var menuObj  = descArray[index];

  var html = '';
  switch (menuObj.type) {
        case 'news':
            //根据素材ID获取文章列表内容
            $.ajax({
                type: 'POST',
                dataType: 'json',
                traditional: true,
                url: "/member/Wxmenu/getMeida",
                data: {mid: menuObj.media_id},
                success: function (res) {
                    if (res.code == 1) {
                        var news_lists = res.data.news_item;
                            //多图文
                            html = ' <div class="wkzc-phone-lan1"><div class="wkzc-phone-lan-duotw">';
                        for (var i in news_lists) {
                            if (news_lists.length == 1) {
                               html += '<a href="' + news_lists[i].url + '" class="wkzc-phone-lan-a3" target="_blank">'; 
                            } else if (i == 0) {
                               html += '<a href="' + news_lists[i].url + '" target="_blank" class="wkzc-phone-lan-a1">'; 
                            } else {
                               html += '<a href="' + news_lists[i].url + '" target="_blank" class="wkzc-phone-lan-a2">';
                            }
                            html += '<img src="' + news_lists[i].thumb_url + '">';
                            if (news_lists.length == 1) {
                                html += '<p>' + news_lists[i].title + '</p>';
                            }else{
                                html += '<span>' + news_lists[i].title + '</span>';
                            }
                            html += '<div><p>预览文章</p></div></a>';
                        }
                            html += '</div></div>';
                        $(".wkzc-phone-main-body").append(html);
                        $(".wkzc-phone-main-body").scrollTop($(".wkzc-phone-main-body")[0].scrollHeight);
                    } else {
                        layer.msg(res.msg);
                    }
                }
            });

            break;
        case 'text':
            var text = htmlspecialchars_decode(menuObj.value);
            var avatar = wechat_info.avatar;
            html = '<div class="wkzc-phone-lan1"><div class="wkzc-phone-wenzi">';
            html += '<p class="wkzc-phone-wenzi-p1"><img src="'+ avatar +'"></p>';
            html += '<div class="wkzc-phone-wenzi-p2">'+ text +'</div>';
            html += '<p class="wkzc-phone-wenzi-p3"></p></div></div>';
            $(".wkzc-phone-main-body").append(html);
            break;
        case 'img':
            html = '<div class="wkzc-phone-lan1">';
            html += '<div class="wkzc-phone-tupian">';
            html += '<img src="' + menuObj.image_url + '" media_id="' + menuObj.value + '" alt="">';
            html += '</div></div>';
            $(".wkzc-phone-main-body").append(html);
            break;
        case 'voice':
            html = '<div class="wkzc-phone-lan1"><div class="wkzc-phone-yuyin">';
            html += '<p class="wkzc-phone-yuyin-p1"><img src="http://imgal.xmyeditor.com/uploads/1/5/20181205/3d92837d2252d2554ea7fbfcff7ea042thumb.png"></p>';
            html += '<div class="wkzc-phone-yuyin-div1">';
            html += '<p class="wkzc-phone-yuyin-p2">'+ menuObj.name +'</p>';
            html += '<p class="wkzc-phone-yuyin-p3">'+ menuObj.times +'</p></div></div></div>';
            $(".wkzc-phone-main-body").append(html);
            break;
        case 'video':
            
            break;
        case 'view':
            window.open(menuObj.url);
            break;
        default:
            return false;
    }
    $(".wkzc-phone-main-body").scrollTop($(".wkzc-phone-main-body")[0].scrollHeight);
});
//预览弹窗，子菜单按钮单击事件
$(document).on("click",".wkzc-phone-list-body > p",function(){
    var index =  $(this).data("index");
    var par_index = $(this).parents("li").data("index");
    var menuObj  = descArray[par_index].sub_button[index];
    var html = '';
    switch (menuObj.type) {
        case 'news':
            //根据素材ID获取文章列表内容
            $.ajax({
                type: 'POST',
                dataType: 'json',
                traditional: true,
                url: "/member/Wxmenu/getMeida",
                data: {mid: menuObj.media_id},
                success: function (res) {
                    if (res.code == 1) {
                        var news_lists = res.data.news_item;
                            //多图文
                            html = ' <div class="wkzc-phone-lan1"><div class="wkzc-phone-lan-duotw">';
                        for (var i in news_lists) {
                            if (news_lists.length == 1) {
                               html += '<a href="' + news_lists[i].url + '" class="wkzc-phone-lan-a3" target="_blank">'; 
                            } else if (i == 0) {
                               html += '<a href="' + news_lists[i].url + '" target="_blank" class="wkzc-phone-lan-a1">'; 
                            } else {
                               html += '<a href="' + news_lists[i].url + '" target="_blank" class="wkzc-phone-lan-a2">';
                            }
                            html += '<img src="' + news_lists[i].thumb_url + '">';
                            if (news_lists.length == 1) {
                                html += '<p>' + news_lists[i].title + '</p>';
                            }else{
                                html += '<span>' + news_lists[i].title + '</span>';
                            }
                            html += '<div><p>预览文章</p></div></a>';
                        }
                            html += '</div></div>';
                        $(".wkzc-phone-main-body").append(html);
                        $(".wkzc-phone-main-body").scrollTop($(".wkzc-phone-main-body")[0].scrollHeight);
                    } else {
                        layer.msg(res.msg);
                    }
                }
            });
            break;
        case 'text':
            var text = htmlspecialchars_decode(menuObj.value);
            var avatar = wechat_info.avatar;
            html = '<div class="wkzc-phone-lan1"><div class="wkzc-phone-wenzi">';
            html += '<p class="wkzc-phone-wenzi-p1"><img src="'+ avatar +'"></p>';
            html += '<div class="wkzc-phone-wenzi-p2">'+ text +'</div>';
            html += '<p class="wkzc-phone-wenzi-p3"></p></div></div>';
            $(".wkzc-phone-main-body").append(html);
            $(".wkzc-phone-main-body").scrollTop($(".wkzc-phone-main-body")[0].scrollHeight);
            break;
        case 'img':
            html = '<div class="wkzc-phone-lan1">';
            html += '<div class="wkzc-phone-tupian">';
            html += '<img src="' + menuObj.image_url + '" media_id="' + menuObj.value + '" alt="">';
            html += '</div></div>';
            $(".wkzc-phone-main-body").append(html);
            $(".wkzc-phone-main-body").scrollTop($(".wkzc-phone-main-body")[0].scrollHeight);
            break;
        case 'voice':
            html = '<div class="wkzc-phone-lan1"><div class="wkzc-phone-yuyin">';
            html += '<p class="wkzc-phone-yuyin-p1"><img src="http://imgal.xmyeditor.com/uploads/1/5/20181205/3d92837d2252d2554ea7fbfcff7ea042thumb.png"></p>';
            html += '<div class="wkzc-phone-yuyin-div1">';
            html += '<p class="wkzc-phone-yuyin-p2">'+ menuObj.name +'</p>';
            html += '<p class="wkzc-phone-yuyin-p3">'+ menuObj.times +'</p></div></div></div>';
            $(".wkzc-phone-main-body").append(html);
            $(".wkzc-phone-main-body").scrollTop($(".wkzc-phone-main-body")[0].scrollHeight);
            break;
        case 'video':
            
            break;
        case 'view':
            window.open(menuObj.url);
            break;
        default:
            return false;
    }
});


// 表情插入, 连接插入
$(document).on('click','.layui-layer-content li',function () {
    // 判断是否是表情，还是连接
    var _this = $(this);
    var src = _this.find('img').attr('src');
    var is_fal = false;
    if(src === undefined){ // 连接
        var vals = $.trim(_this.find('button').html());
        if(vals == '确定'){
            is_fal = true;
        }
    }else{ // 图片
        if (src.indexOf('http:') >= 0) {
            is_fal = true;
        }
    }
    if(is_fal){
        var cont = layedit.getContent(text_index);
        var len = cont.getBytes();
        var inputlen = 230 - len;
        if(inputlen >= 0){
            var newl = '';
        }else{
            inputlen = 0;
            var newl = '（已超出'+(len-230)+'字）';
        }
        $('.wkzc-right-set-position-footer-p').find('span').html(inputlen);
        $('.wkzc-right-set-position-footer-p').find('p').eq(1).html(newl);
    }
});


String.prototype.getBytes = function () {
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
};


/*22*/
function htmlspecialchars_decode(string, quote_style) {
    var optTemp = 0
        , i = 0
        , noquotes = false;
    if (typeof quote_style === 'undefined') {
        quote_style = 2;
    }
    string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') {
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            } else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/&#0*39;/g, "'");
    }
    if (!noquotes) {
        string = string.replace(/&quot;/g, '"');
    }
    string = string.replace(/&amp;/g, '&');
    return string;
}

$(document).on("click",".wkzc-enjom-biao",function(ev){
      ev.stopPropagation();
      var offset = $(this).offset();
      $(".emiges-Mean").css({"top":offset.top - 50,"left":offset.left}).show();
});

  //点击表情插入文本框
$(document).on("click",".emiges-Mean td",function (ev) {
    ev.stopPropagation();
    var obj = $(".wkzc-right-much .wkzc-right-name input")[0];
    if($(".wkzc-left-nav-addli").hasClass('wkzc-find-nav') && $(".wkzc-left-nav-addli").next().find("li").length > 1){
        obj = $(".wkzc-right-mean .wkzc-right-name input")[0];
    }
    var text = $(this).data("value");
    var cate_name = $(this).data("catename");
    var key = $(this).data("key");
    createEmojiHistory(cate_name,key);

    var sel_text = getSelectText(obj);
    var length = obj.selectionEnd + text.length - sel_text.length;
    insertAtCaret(obj,text);
    setCaretPosition(obj,length);

    var val = $(".wkzc-right-much .wkzc-right-name input").val();
    //判断主菜单还是子菜单
    if($(".wkzc-left-nav-addli").hasClass('wkzc-find-nav')){
        if($(".wkzc-left-nav-addli").next().find("li").length > 1){
            val = $(".wkzc-right-mean .wkzc-right-name input").val();
        }
        len = 10;
        //校验名称长度
        if(val.getBytes() > len){
            $('.wkzc-right-name span').css("color","red");
        }
        $('.wkzc-right-name span').text("主菜单字数不超过5个汉字或10个字母");
    }else{
        len = 40;
        //校验名称长度
        if(val.getBytes() > len){
            $('.wkzc-right-name span').css("color","red");
        }
        $('.wkzc-right-name span').text("子菜单字数不超过20个汉字或40个字母");
    }
    console.log(val);
    $(".wkzc-left-nav-addli").find(".menu_name").html(emoji2img(val));
    setDescArray("name",val);
    if(!ev.ctrlKey){
        $(".emiges-Mean").hide();
    }
});
$(document).on("click",function(ev){
    $(".emiges-Mean").hide();
});

$(document).on("click",".emiges-Mean",function(ev){
    ev.stopPropagation();
})

//清除错误提示
function removeError(){
            $(".wkzc-right-main").removeClass("error");
             $(".menu-none-tips").hide();
}
$(document).on("click",".confirm-release-tit i",function(ev){
    $(".confirm-release-foot2").click();
});







// 关键词回复





// 我的工具栏分组选择
$('.wxcd-key-words-top-main p').on('click',function (event) {
    event.stopPropagation();
    $(this).siblings().toggle();
    var tag = $(this).siblings();
    var flag = true;
    $(document).bind("click",function(e){//点击空白处，设置的弹框消失
        var target = $(e.target);
        if(target.closest(tag).length == 0 && flag == true){
            $(tag).hide();
            flag = false;
        }
    });
});
// 替换分组文字
$(document).on("click",".wxcd-key-words-top-main ul li",function(){
    $(this).parent().hide();
    $(".wxcd-key-words-top-main p span").html($(this).html());
    //切换分组，展示对应数据
    var group_id = $(this).data("groupid");
    if (group_id == 0) {
        $(".wxcd-key-words-main > ul > li").show();
    } else {
        $(".wxcd-key-words-main > ul > li").hide();
        $(".wxcd-key-words-main > ul > li[data-groupid="+group_id+"]").show();
    }
});

$(document).on("click",".wxcd-key-words-main ul li",function() {
    $(".wxcd-key-words-main ul li i").hide();
    $(this).find('i').toggle();
    setDescArray("type","text");
    setDescArray("value","[keyword_reply]"+$(this).data("keywords"));
});
