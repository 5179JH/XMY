
layui.use(['layer','form','layedit','upload','flow','laytpl'], function(exports){
	var layer = layui.layer;
    var form = layui.form;
    var layedit = layui.layedit;
    var upload = layui.upload;
    var flow = layui.flow;
    var laytpl = layui.laytpl;

	// 添加主菜单
    $(document).on('click','.wxcL-all',function(){
    	// 主菜单长度不能超过三个
    	if( $('.wxcL-one').length > 2 ){
    		layer.msg('最多添加三个主菜单',{time:1500});
    	}else{
    		// 去除其他菜单选中
    		$('.wxcL-add').removeClass('wxcL-add');
    		// 插入主菜单
    		$('.wxcL-nav').append($('#wxcL-a-html').html());
            // 渲染菜单右侧数据
            wxcL_navRender();
    	}
    });
    // 删除主菜单
    $(document).on('click','.wxcL-a-p4',function(){
    	// 当前主菜单下子菜单长度
    	var this_length = $(this).parent().siblings().children().length;
    	// 当前主菜单名称
    	var this_name = $(this).siblings('.wxcL-a-p1').html();
    	// 判断是否有子菜单
    	if( this_length > 0 ){
    		// 主菜单下有子菜单不可删除
    		layer.msg('请先删除【'+this_name+'】下的子菜单',{time:1500})
    	}else{
    		// 主菜单下没有子菜单可删除
    		$(this).parent().parent().remove();
    		// 菜单选中
            if( $('.wxcL-sign').length > 0 && $('.wxcL-add').length == 0 ){
                $('.wxcL-sign').eq(0).addClass('wxcL-add');
            }
            // 渲染菜单右侧数据
            wxcL_navRender();
    	}
    });
    // 子菜单折叠与展开
    $(document).on('click','.wxcL-a-p2',function(){
        var this_i = $(this).children('i');
        var this_chid = $(this).parent().siblings();
        if( this_i.hasClass('fa-caret-down') ){
            this_i.addClass('fa-caret-right').removeClass('fa-caret-down');
            this_chid.hide();
        }else{
            this_i.addClass('fa-caret-down').removeClass('fa-caret-right');
            this_chid.show();
        }
    });
    // 添加子菜单
    $(document).on('click','.wxcL-a-p3',function(){
        // 获取子菜单容器
        var this_children = $(this).parent().siblings()
        // 子菜单超过5个不可添加
        if( this_children.children().length > 4 ){
            layer.msg('当前主菜单下最多添加五个子菜单',{time:1500});
            return false;
        }
        // 去除其他菜单选中
        $('.wxcL-add').removeClass('wxcL-add');
        // 插入子菜单
        this_children.append($('#wxcL-b-html').html());
        // 主菜单倒三角显示
        $(this).siblings('.wxcL-a-p2').show();
        // 主菜单类型改为2
        $(this).siblings('.wxcL-a-p1').attr("data-tpye",0);
        // 子菜单等于五个隐藏加号
        if( this_children.children().length == 5 ){
            $(this).hide();
        }
        // 渲染菜单右侧数据
        wxcL_navRender();
    });
    // 删除子菜单
    $(document).on('click','.wxcL-b-p2',function(){
        // 子菜单对应的容器ul
        var this_par = $(this).parent().parent();
        // 主菜单加号显示
        this_par.siblings().children('.wxcL-a-p3').show();
        // 如果当前子菜单为空,主菜单隐藏三角
        if( this_par.children().length == 1 ){
            this_par.siblings().children('.wxcL-a-p2').hide();
            this_par.siblings().children('.wxcL-a-p1').attr("data-tpye",1);
        }
        // 移除子菜单
        $(this).parent().remove();
        // 菜单选中
        if( $('.wxcL-sign').length > 0 && $('.wxcL-add').length == 0 ){
            $('.wxcL-sign').eq(0).addClass('wxcL-add');
        }
        // 渲染菜单右侧数据
        wxcL_navRender();
    });
    // 鼠标移动一级菜单和二级菜单
    nav_move();
    function nav_move(){
		$(".wxcL-a-ul").sortable();
        $(".wxcL-a-ul").disableSelection();
        $(".wxcL-nav").sortable();
        $(".wxcL-nav").disableSelection();
    }
    // 选择菜单
    $(document).on('click','.wxcL-sign',function(){
        $('.wxcL-sign').removeClass('wxcL-add');
        $(this).addClass('wxcL-add');
        // 渲染菜单数据
        wxcL_navRender();
    });



    // 菜单名称
    // 获取字符串长度 ：中文长度为2
    String.prototype.getBytes = function () {
        var cArr = this.match(/[^\x00-\xff]/ig);
        return this.length + (cArr == null ? 0 : cArr.length);
    };
    // 名称输入框监听
    $(document).on('input', '.wxcR-name-p2 input', function (){
        // 当前菜单是一级菜单还是二级菜单
        var this_grad = $('.wxcL-add').attr("data-grad");
        // 当前菜单内容长度
        var this_nums = $('.wxcR-name-p2 input').val().getBytes();
        // 判断字数
        if( this_grad == 1 ){
            if( this_nums > 10 ){
                $('.wxcR-name-p4').css("color","#ff5439");
                $('.wxcR-name').attr("data-num",2);
            }else{
                $('.wxcR-name-p4').css("color","#aaaaaa");
                $('.wxcR-name').attr("data-num",1);
            }
        }else{
            if( this_nums > 40 ){
                $('.wxcR-name-p4').css("color","#ff5439");
                $('.wxcR-name').attr("data-num",2);
            }else{
                $('.wxcR-name-p4').css("color","#aaaaaa");
                $('.wxcR-name').attr("data-num",1);
            }
        }
    });
    // 失去焦点判断赋值
    $(document).on('blur','.wxcR-name-p2 input',function(){
        // 为空提示
        if( $('.wxcR-name-p2 input').val().replace(/(^\s*)|(\s*$)/g, "") == '' ){
            layer.msg('菜单名称不能为空',{time:1500});
            $('.wxcR-name-p2 input').val('');
            return false;
        }
        // 超出提示
        if( $('.wxcR-name').attr("data-num") == 2 ){
            layer.msg($('.wxcR-name-p4').html(),{time:1500});
            return false;
        }
        // 修改菜单名称
        $('.wxcL-add').html($('.wxcR-name-p2 input').val());
    })

    // 发送消息
    form.on('radio(wxcRChoseRadio1)', function(data){
        // 发送消息显示
        $('.wxcR-type').show();
        // 跳转网页隐藏
        $('.wxcR-url').hide();
        // 赋值菜单类型
        $('.wxcR-body').attr("data-type",$('.wxcR-nav-add').index()+1);
    });
    // 跳转网页
    form.on('radio(wxcRChoseRadio2)', function(data){
        // 发送消息隐藏
        $('.wxcR-type').hide();
        // 跳转网页显示
        $('.wxcR-url').show();
        // 赋值菜单类型
        $('.wxcR-body').attr("data-type",'6');
    });
    // 发送消息-选择相应内容
    $(document).on('click','.wxcR-nav li',function(){
        // 获取当前菜单下表
        var this_index = $(this).index();
        // 菜单被选中
        $(this).addClass('wxcR-nav-add').siblings().removeClass('wxcR-nav-add');
        // 对应菜单内容展示
        $('.wxcR-con li').eq(this_index).show().siblings().hide();
        // 赋值菜单类型
        $('.wxcR-body').attr("data-type",this_index+1);
    });
    // 选择图文
    $(document).on('click','.wxcR-act-chose-pop',function(){
        layer.open({
            title: ['选择图文', 'font-size:16px;text-align:center;color:#333;'],
            type:2,
            skin: 'layui-layer-new', 
            area: ['910px','600px'], 
            move:false,
            closeBtn:2,
            shade:0.6,
            shadeClose:false,
            btn: ['取消','确定'],
            content:'/member/wxcommon/wxnews',
            scrollbar: false,
            btn2: function(index, layero){
                var body = layer.getChildFrame('body', index);
                var art_cont = body.find('.art-film-add').html();
                if( art_cont == undefined ){
                    layer.msg("请选择图文",{time:1500});
                    return false;
                }else{
                    $('.wxcR-act-show-main').html(art_cont+'<div class="wxcR-act-del">删除</div>');
                    // 关闭图文选择
                    $('.wxcR-act-chose').hide();
                    // 开启图文预览
                    $('.wxcR-act-show').show();
                }
            }
        });
    });
    // 删除图文
    $(document).on('click','.wxcR-act-del',function(){
        // 清空预览
        $('.wxcR-act-show-main').html('');
        // 展示隐藏
        $('.wxcR-act-show').hide();
        // 选择图文展示
        $('.wxcR-act-chose').show();
    });
    // 文字编辑编辑器
    newseditor = layedit.build('wxeditor10',{
        height:205
        ,tool: [ 'face','link', 'unlink']
    });
    active = {
        // 获取内容
        content: function (){return layedit.getContent(newseditor);}
        // 获取内容
        , text: function (){return layedit.getText(newseditor);}
    };
    $("iframe").contents().find("body").keyup(function () {
        var textedi = active['content'] ? active['content'].call(this) : '';
        menutxtnums(textedi)
    });
    // 选择图片
    $(document).on('click','.wxcR-img-left,.wxcR-img-sel',function(){
        layer.open({
            title: ['选择图片', 'font-size:16px;text-align:center;color:#333;'],
            type:2,
            skin:'layui-layer-new', 
            area:['774px','610px'], 
            move:false,
            closeBtn:2,
            shade:0.6,
            shadeClose:false,
            btn: ['取消','确定'],
            content:'/member/wxcommon/wximage',
            scrollbar: false,
            btn2: function(index, layero){
                var body = layer.getChildFrame('body', index);
                var img_cont = body.find('.wximag-li-add');
                if( img_cont.html() == undefined ){
                    layer.msg("请选择图片",{time:1500});
                    return false;
                }else{
                    $('.wxcR-img-show-img').html(img_cont.find('.wximag-li-p1').html()+'<span class="wxcR-img-sel"><i class="fa fa-retweet"></i>替换素材</span>');
                    // 关闭图片选择
                    $('.wxcR-img-chose').hide();
                    // 开启图片预览
                    $('.wxcR-img-show').show();
                }
            }
        });
    });
    // 上传图片
    var uploadInst = upload.render({
        elem: '.wxcR-img-right' //绑定元素
        ,url: '/member/wxcommon/upLoadStyle' //上传接口
        ,accept: 'images'
        ,acceptMime: 'image/bmp,image/png,image/jpg,image/jpeg,image/gif'
        ,size:2048
        ,data: {"type":"image"}
        // 上传前回调
        ,before: function(obj){
             Loading() // 加载
        }
        // 上传后回调
        ,done: function(res,index,upload){
            LoadClose() // 关闭加载
            if( res.code == 1 ){
                var str = '<img src="'+res.data.url+'" data-name="'+res.data.filename+'" data-id="'+res.data.media_id+'"><span class="wxcR-img-sel"><i class="fa fa-retweet"></i>替换素材</span>'
                $('.wxcR-img-show-img').html(str);
                // 关闭图片选择
                $('.wxcR-img-chose').hide();
                // 开启图片预览
                $('.wxcR-img-show').show();
            }else{
                layer.msg(res.msg,{time:1500})
            }
        }
        // 上传报错
        ,error: function(){
            LoadClose() // 关闭加载
            layer.msg("服务器连接失败");
        }
    });
    // 选择语音
    $(document).on('click','.wxcR-voc-left,.wxcR-voc-sel',function(){
        layer.open({
            title: ['选择语音', 'font-size:16px;text-align:center;color:#333;'],
            type:2,
            skin: 'layui-layer-new', 
            area: ['740px','580px'], 
            move: false,
            closeBtn:2,
            shade: 0.6,
            shadeClose:false,
            btn: ['取消','确定'],
            content:'/member/wxcommon/wxvoice',   
            scrollbar: false,
            btn2: function(index, layero){
                var vic_data = [];
                var body = layer.getChildFrame('body', index);
                // 是否选择语音
                var wxvic = body.find('.wxvic-add');
                // 判断是否选中语音
                if( wxvic.html() == undefined ){
                    layer.msg("请选择语音",{time:1500});
                    return false;
                }
                vic_data = {'name':wxvic.attr("data-name"),'url':wxvic.attr("data-url"),'min':wxvic.attr("data-min"),'sec':wxvic.attr("data-sec"),'id':wxvic.attr("data-id")};
                if( vic_data.url == '' ){
                    Loading() // 加载
                    ajax_none({"media_id":vic_data.id},'/member/wxcommon/getVoiceInfo','post',false,function (result) {
                        result = typeof result === 'string' ? $.parseJSON(result) : result;
                        LoadClose() // 关闭加载
                        if(  result.code == 1  ){
                            // 获取分钟
                            vic_data.min = Math.floor(result.data.times / 60);
                            // 分钟数小于10前面加0
                            if( vic_data.min<10 ){vic_data.min = '0'+vic_data.min}
                            vic_data.min = vic_data.min+':'+Math.ceil(result.data.times % 60);
                            // 获取秒数
                            vic_data.sec = Math.ceil(result.data.times);
                            // 音乐链接
                            vic_data.url = result.data.voice_url;
                        }else{
                            layer.msg(result.msg,{time:1500});
                        }
                    });
                };
                // 语音渲染
                wxvic_render(vic_data);
            }
        });
    });
    // 上传语音
    var uploadvic = upload.render({
        elem: '.wxcR-voc-right' //绑定元素
        ,url:'/member/wxcommon/upLoadStyle' //上传接口
        ,accept: 'audio'
        ,acceptMime: 'audio/mp3,audio/wma,audio/wav,audio/amr'
        ,data: {"type":"voice"}
        ,size:2048
        // 上传前回调
        ,before: function(obj){
            Loading() // 加载
        }
        // 上传后回调
        ,done: function(res,index,upload){
            LoadClose() // 关闭加载
            if( res.code == 1 ){
                // 音乐数据
                vic_data = {'name':res.data.filename,'id':res.data.media_id};
                // 秒数
                vic_data.sec = Math.ceil(res.data.times);
                // 获取分钟
                vic_data.min = Math.floor(res.data.times / 60);
                // 分钟数小于10前面加0
                if( vic_data.min<10 ){vic_data.min = '0'+vic_data.min}
                vic_data.min = vic_data.min+':'+Math.ceil(res.data.times % 60);
                // 请求链接
                ajax_none({"media_id":vic_data.id},'/member/wxcommon/getVoiceInfo','post',true,function (result) {
                    result = typeof result === 'string' ? $.parseJSON(result) : result;
                    LoadClose() // 关闭加载
                    // 请求成功
                    if( result.code == 1 ){
                        // 音乐链接
                        vic_data.url = result.data.voice_url;
                        // 语音渲染
                        wxvic_render(vic_data);
                    }else{
                        layer.msg(result.msg,{time:1500});
                    }
                });
            }else{
                layer.msg(res.msg,{time:1500});
            }
        }
        // 上传报错
        ,error: function(){
            LoadClose() // 关闭加载
            layer.msg("服务器连接失败");
        }
    });
    // 语音渲染
    function wxvic_render(data){
        // 语音html
        var voice_html ='<div class="voice-main" data-id="'+data.id+'" data-url="'+data.url+'" data-min="'+data.min+'" data-sec="'+data.sec+'">'+
                            '<div class="voice-main-left">'+
                                '<i class="auto-cicon23"></i>'+
                                '<img src="/static/wxmember/img/music_audio.gif" style="display:none;">'+
                            '</div>'+
                            '<div class="voice-main-right">'+
                                '<p class="c-hide1">'+data.name+'</p>'+
                                '<p></p>'+
                                '<p><span class="voice-main-time1">'+data.min+'</span><span class="voice-main-time2" style="display:none;">00:00</span></p>'+
                            '</div>'+
                            '<audio src="'+data.url+'" class="wxvic-play"></audio>'+
                            '<span class="wxcR-voc-sel"><i class="fa fa-retweet"></i>替换素材</span></p>'
                        '</div>'
        // 选中语音隐藏
        $('.wxcR-voc-chose').hide();
        // 语音展示显示
        $('.wxcR-voc-show').html(voice_html).show();
    }
    // 点击播放
    $(document).on('click','.voice-main-left i',function(){
        //jquery对象转换成js对象
        var player = $('.wxvic-play')[0];
        // 获取时间
        var this_sec = $('.voice-main').attr("data-sec");
        // 进入播放状态
        $(this).hide();
        $('.voice-main-left img').show();
        $('.voice-main-time2').show();
        // 倒计时
        settime(this_sec)
        // 音乐播放
        player.play();
    });
    // 获取关键词分组
    $(function(){
        // 获取关键词分组
        ajax_none({},'/member/wxmenu/getGroup','post',true,function (result){
            result = typeof result === 'string' ? $.parseJSON(result) : result;
            if( result.code == 1 ){
                // 遍历所有分组并渲染到页面
                var str = '<option value="-1">全部</option><option value="0">未分组</option>';
                $.each(result.data,function(i,itm){
                    str += '<option value="'+itm.id+'">'+itm.name+'</option>'
                })
                $('.wxcR-key-sel').html(str);
                // 重置下拉效果
                form.render();
            }else{
                layer.msg(result.msg,{time:1500});
            }
        });  
    })
    // 分组选择
    form.on('select(wxcR-key-select)', function(data){
        wxcR_keyList(data.value);
    });
    // 获取关键词列表
    wxcR_keyList(-1);
    function wxcR_keyList(group){
        // 清空关键词列表
        $('.wxcR-key-ul').html('');
        // 数据渲染
        flow.load({
            //指定列表容器
            elem: '.wxcR-key-ul'
            ,scrollElem: '.wxcR-key-ul'
            ,isAuto:true
            ,end:"已显示全部关键字"
            ,mb:50
            //到达临界点（默认滚动触发），触发下一页
            ,done: function(page, next){
                ajax_none({group_id:group,page:page,limit:6},'/member/wxmenu/getKeywords','post',true,function (result){
                    result = typeof result === 'string' ? $.parseJSON(result) : result;
                    if( result.code == 1 ){
                        // 数据转化
                        $.each(result.data,function(a,abc){
                            abc.content = typeof abc.content === 'string' ? $.parseJSON(abc.content) : abc.content;
                            abc.keyword = typeof abc.keyword === 'string' ? $.parseJSON(abc.keyword) : abc.keyword;
                            // 转化回复内容
                            result.data[a].num_txt = '';
                            var img_num = 0;
                            var voc_num = 0;
                            var art_num = 0;
                            var txt_num = 0;
                            var num_txt = '';
                            // 遍历每一条消息
                            $.each(abc.content,function(b,bcd){
                                if(bcd.type === 'image') img_num ++;
                                if(bcd.type === 'voice') voc_num ++;
                                if(bcd.type === 'news') art_num ++;
                                if(bcd.type === 'text') txt_num ++;
                            });
                            if( art_num == 0 ){num_txt+=''}else{num_txt+=art_num+"图文 "};
                            if( txt_num == 0 ){num_txt+=''}else{num_txt+=txt_num+"文本 "};
                            if( img_num == 0 ){num_txt+=''}else{num_txt+=img_num+"图片 "};
                            if( voc_num == 0 ){num_txt+=''}else{num_txt+=voc_num+"语音 "};
                            result.data[a].num_txt = num_txt;

                            // 转化关键字
                            result.data[a].key_html = '';
                            var key_html = '';
                            $.each(abc.keyword,function(c,cde){
                                key_html += ' '+cde.title;
                            });
                            result.data[a].key_html = key_html
                        });
                        laytpl($('#wxcR-key-html').html()).render(result.data, function(html){
                            if( result.count == 0 ){
                                $('.wxcR-key-ul').hide();
                                $('.wxcR-key-none').show();
                            }else{
                                $('.wxcR-key-ul').show();
                                $('.wxcR-key-none').hide();
                            }
                            next(html, page < result.count/6);
                        });
                    }else{
                        layer.msg(result.msg,{time:1500});
                    }
                });
            }
        }); 
    }
    // 关键词选择
    $(document).on('click','.wxcR-key-li',function(){
        // 关键词选中效果
        $(this).addClass('wxcR-key-li-add').siblings().removeClass('wxcR-key-li-add');
        // 关键词ID赋值
        $('.wxcR-key').attr("data-key",$(this).attr("data-id"));
    });
    // 跳转网址选择
    $(document).on('click','.wxcR-url-tips',function(){
        layer.open({
            title: ['选择图文', 'font-size:16px;text-align:center;color:#333;'],
            type:2,
            skin: 'layui-layer-new', 
            area: ['910px','600px'], 
            move:false,
            closeBtn:2,
            shade:0.6,
            shadeClose:false,
            btn: ['取消','确定'],
            content:'/member/wxcommon/wxnews',
            scrollbar: false,
            btn2: function(index, layero){
                var body = layer.getChildFrame('body', index);
                var art_cont = body.find('.art-film-add');
                if( art_cont.html() == undefined ){
                    layer.msg("请选择图文",{time:1500});
                    return false;
                }else{
                    $('.wxcR-url-iput input').val(art_cont.find('.art-sole').attr("data-url"));
                }
            }
        });
    });




    // 渲染菜单数据
    function wxcL_navRender(){
        // 获取当前菜单是否存在
        if( $('.wxcL-sign').length == 0 ){
            // 菜单编辑隐藏
            $('.wxc').hide();
            // 暂无菜单显示
            // $('.wxc-none').show();
            return false;
        }else{
            // 菜单编辑显示
            $('.wxc').show();
            // 暂时菜单隐藏
            // $('.wxc-none').hide();
        }
        // 获取当前菜单等级
        var this_grad = $('.wxcL-add').attr("data-grad");
        //  判断是否展示菜单内容
        var this_type = $('.wxcL-add').attr("data-tpye");
        // 获取当前菜单数据
        var this_data = $.parseJSON($('.wxcL-add').attr("data-info"));
        // 获取当前菜单名称
        var this_name = $('.wxcL-add').html();
        // 判断是否展示菜单内容
        if( this_type == 0 ){
            $('.wxcR-body').hide();
        }else{
            $('.wxcR-body').show();
        }
        // 菜单名称赋值
        $('.wxcR-name-p2 input').val(this_name);
        if( this_grad == 1 ){
            $('.wxcR-name-p4').html('主菜单字数不超过5个汉字或10个字母');
        }else{
            $('.wxcR-name-p4').html('子菜单字数不超过20个汉字或40个字母');
        }
        // 赋值菜单类型
        // $('.wxcR-body').attr("data-type",this_type)
        // 赋值菜单内容
        console.log(this_data);
    }
    // 获取当前菜单数据
    function wxcR_navData(){
        
    }




    // 判断字数
    function menutxtnums(cont){
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var imgarr = cont.match(imgReg);  // arr 为包含所有img标签的数组
        cont = cont.replace(/<img[^>]*\/?>/g, '');
        cont = cont.replace(/<p\>|<\/p>|<br\/?>/g, '');
        var conlen = cont.length;
        var imglen = 0;
        if (imgarr != null) {
            imglen = (imgarr.length) * 4;
        }
        var len = parseInt(conlen) + parseInt(imglen);
        var inputlen = 230 - len;
        if (inputlen >= 0) {
            var newl = '';
            $('.wxeditor-tips span').text('还可以输入' + inputlen + '字' );
            $('.wxeditor-tips span').css("color","#999");
        } else {
            inputlen = 0;
            var newl = '（已超出' + (len - 230) + '字）';
            $('.wxeditor-tips span').text(newl);
            $('.wxeditor-tips span').css("color","#ff5439");
        }
    }
    // 计时器函数
    function settime(dats){
        // 计时归零
        $('.voice-main-time2').html('00:00')
        //jquery对象转换成js对象
        var player = $('.wxvic-play')[0];
        var sec = 0,min = 0,dat = 0;
        intval_voice_time = setInterval(function(){
            dat++,sec++
            // 当秒数小于10时，秒数前加0
            if( sec < 10 ){
                sec='0'+sec
            }
            // 当秒数等于60时，秒数清零0，分钟加1
            if(sec == 60){
                sec = 0
                sec='0'+sec
                min++
            }
            // 当分钟小于10时，分钟前加0
            if( min < 10 ){
                min="0" + parseInt(min)
            }else if( min == 0 ){
                min = "0" + min
            }
            // 插入时间
            $('.voice-main-time2').html(min+':'+sec)
            // 时间到了清除计时器
            if( dat == dats ){
                clearInterval(intval_voice_time);
                //暂停
                player.pause();
                $('.voice-main-left img').hide();
                $('.voice-main-left i').show();
                $('.voice-main-time2').hide();
            }
        },1000);
    }


});