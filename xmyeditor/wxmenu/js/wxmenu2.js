layui.use(['form', 'upload','layer','layedit','laytpl','laydate','laypage','jqueryui','flow'], function(exports){
	var form = layui.form
	,upload = layui.upload
	,layer = layui.layer
	,layedit = layui.layedit
	,laytpl = layui.laytpl
	,jqueryui = layui.jqueryui
	,flow = layui.flow


	// 首次渲染菜单数据
	$(function(){
 		// 请求菜单数据
 		layer.load(2,{shade: [0.1,'#fff']});//加载
 		xrequest({id:wechat_id},api_domain+'/apimember/wxmenu/findMenu','post',true,function (result){
	  		result = typeof result === 'string' ? $.parseJSON(result) : result;
	  		layer.closeAll('loading');//关闭加载
	  		if( result.code == 1 ){
	  			if( !result.data.json == '' ){
	  				var data = result.data.json = typeof result.data.json === 'string' ? $.parseJSON(result.data.json) : result.data.json;
	  				laytpl($('#nav-html-show').html()).render(data, function(html){
					 	$('.wxnav').html(html);
					});
					// 第一个主菜单默认选中，并渲染数据
					$('.wxnav-a').eq(0).addClass('wxnav-nav-add');
					nav_dat_xiu();
	  			}
	  			// 判断一级菜单数量
				nav_a_num();
				// 判断二级菜单数量
				nav_b_num();
				// 菜单移动
				nav_move();
				// 时间函数
				menu_time(result.data);
	  		}else{
	  			layer.msg(result.msg,{time:1500});
	  		}
	  	});
	});
	// 判断一级菜单数量，三角、加号、预览按钮是否显示
    function nav_a_num(){
    	// 一级菜单长度
    	var nav_a_leng = $('.wxnav-one').length;
    	// 当长度为0时,不显示三角,显示加号
    	if( nav_a_leng == 0 ){
    		$('.wxmenu-all p').removeClass('wxmenu-all-p');
    		$('.wxmenu-all span').show();
    		$('.navcon').hide();
    		$('.nav-view').hide();
    	// 当长度为3时，显示三角，不显示加号
    	}else if( nav_a_leng == 3 ){
    		$('.wxmenu-all p').addClass('wxmenu-all-p');
    		$('.wxmenu-all span').hide();
    		$('.navcon').show();
    		$('.nav-view').show();
    	// 当长度为1和2时，显示三角和加号
    	}else{
    		$('.wxmenu-all p').addClass('wxmenu-all-p');
    		$('.wxmenu-all span').show();
    		$('.navcon').show();
    		$('.nav-view').show();
    	}
    }
    // 判断二级菜单的数量，三角和加号是否显示
    function nav_b_num(){
    	$.each($('.wxnav-ul'),function(i,item){
    		// 一级菜单
    		var nav_a_obj = $(item).prev();
    		// 二级菜单数量
    		var nav_b_num = $(item).children('.wxnav-b').length;
    		// 二级菜单数量为0时，不显示倒三角，显示加号
    		if( nav_b_num == 0 ){
    			nav_a_obj.children('.wxnav-a-p1').removeClass('wxmenu-a-p');
    			nav_a_obj.children('.wxnav-a-p2').show();
    			// 一级菜单类型
    			nav_a_obj.attr("data-id",1);

    		// 二级菜单数量为5时，显示倒三角，不显示加号
	    	}else if( nav_b_num == 5 ){
	    		nav_a_obj.children('.wxnav-a-p1').addClass('wxmenu-a-p');
	    		nav_a_obj.children('.wxnav-a-p2').hide();
	    		// 一级菜单类型
    			nav_a_obj.attr("data-id",2);
	    	// 二级菜单数量为5时，显示倒三角，显示加号
	    	}else{
	    		nav_a_obj.children('.wxnav-a-p1').addClass('wxmenu-a-p');
	    		nav_a_obj.children('.wxnav-a-p2').show();
	    		// 一级菜单类型
    			nav_a_obj.attr("data-id",2);
	    	}
    	})
    }
    // 鼠标移动一级菜单和二级菜单
    nav_move();
    function nav_move(){
		$(".wxnav-ul").sortable();
	    $(".wxnav-ul").disableSelection();
	    $(".wxnav").sortable();
	    $(".wxnav").disableSelection();
    }
    // 一级菜单展开收缩
    $(document).on('click','.wxmenu-all-p',function(){
		var all_nav = $(this).children('i');
		if( all_nav.hasClass('fa-caret-down') ){
			all_nav.addClass('fa-caret-right').removeClass('fa-caret-down');
			$('.wxnav').hide();
		}else{
			all_nav.addClass('fa-caret-down').removeClass('fa-caret-right');
			$('.wxnav').show();
		}
	});
    // 二级菜单展开收缩
    $(document).on('click','.wxnav-a .wxmenu-a-p i',function(){
		// var nav_down = $(this).children('i');
		var nav_chid = $(this).parent().parent().next();
		if( $(this).hasClass('fa-caret-down') ){
			$(this).addClass('fa-caret-right').removeClass('fa-caret-down');
			nav_chid.hide();
		}else{
			$(this).addClass('fa-caret-down').removeClass('fa-caret-right');
			nav_chid.show();
		}
	});
    // 添加一级菜单
    $(document).on('click','.wxmenu-all span',function(){
    	// 一级菜单的长度大于0时,添加前上一个菜单的数据存储到html
    	var menu_a_leng = $('.wxnav-one').length;
    	if( menu_a_leng > 0 ){
    		// 选前数据渲染
			var now_dat = now_show_fun();
			if( now_dat.name == '' ){
				layer.msg("菜单名称不能为空",{time:1500});
				return false;
			}
			// 修改选择前菜单名称
			$('.wxnav-nav-add').attr("data-name",now_dat.name);
			$('.wxnav-nav-add').children('.wxnav-p').children('span').html(now_dat.name);
			// 选择前菜单数据存储在html里
			now_dat = JSON.stringify(now_dat);
			$('.wxnav-nav-add').attr("data-info",now_dat);
    	};
    	// 添加主菜单内容
    	$('.wxnav-a-befor').before($('#nav-a-html-add').html());
    	// 添加的一级菜单被选中
    	$('.wxnav-nav').removeClass('wxnav-nav-add');
    	$('.wxnav-a-befor').prev().find('.wxnav-a').addClass('wxnav-nav-add');
    	// 判断一级菜单的数量，来判断是否有三角、是否有加号
    	nav_a_num();
    	// 判断二级菜单的数量，来判断是否有三角，是否有加号
    	nav_b_num();
    	// 鼠标移动主菜单菜单
    	nav_move();
    	// 渲染当前选中菜单数据
		nav_dat_xiu()
    });
    // 添加二级菜单
    $(document).on('click','.wxnav-a-p2',function(){
    	// 添加前上一个菜单的数据存储到html
    	// 选前数据渲染
		var now_dat = now_show_fun();
		if( now_dat.name == '' ){
			layer.msg("菜单名称不能为空",{time:1500});
			return false;
		}
		// 修改选择前菜单名称
		$('.wxnav-nav-add').attr("data-name",now_dat.name);
		$('.wxnav-nav-add').children('.wxnav-p').children('span').html(now_dat.name);
		// 选择前菜单数据存储在html里
		now_dat = JSON.stringify(now_dat);
		$('.wxnav-nav-add').attr("data-info",now_dat);
    	// 添加子菜单内容
    	$(this).parent().next().children('.wxnav-b-befor').before($('#nav-b-html-add').html());
    	// 添加的二级菜单被选中
    	$('.wxnav-nav').removeClass('wxnav-nav-add');
    	$(this).parent().next().children('.wxnav-b-befor').prev().addClass('wxnav-nav-add');
    	// 判断二级菜单的数量，来判断是否有三角，是否有加号
    	nav_b_num();
    	// 鼠标移动子菜单
    	nav_move();
    	// 渲染当前选中菜单数据
		nav_dat_xiu()
    });
    // 删除一级菜单
    $(document).on('click','.wxnav-a-p3',function(){
    	// 主菜单数量
    	var menu_a_leng = $('.wxnav-a').length;
    	// 当前主菜单下的子菜单数量
    	var son_num = $(this).parent().next().children('.wxnav-b');
    	// 获取当前主菜单的名字
    	var far_name = $(this).siblings('.wxnav-a-p1').children('span').html();
    	// 当主菜单数量大于1时
    	if( menu_a_leng > 1 ){
    		// 当子菜单数量大于=0时
    		if( son_num.length == 0 ){
	    		$(this).parents('.wxnav-one').remove();
	    		$('.wxnav-nav').removeClass('wxnav-nav-add');
	    		$('.wxnav-a').eq(0).addClass('wxnav-nav-add');
	    	}else{
	    		layer.msg("请先删除【"+far_name+"】下的的子菜单",{time:1500})
	    	}
	    	// 渲染当前选中菜单数据
			nav_dat_xiu();
    	}else{
    		if( son_num.length == 0 ){
	    		$(this).parents('.wxnav-one').remove();
	    	}else{
	    		layer.msg("请先删除【"+far_name+"】下的的子菜单",{time:1500})
	    	}
    	}
    	// 判断一级菜单数量，三角和加号是否显示
	    nav_a_num();
    });
    // 删除二级菜单
    $(document).on('click','.wxnav-b-p2',function(){
    	$('.wxnav-nav').removeClass('wxnav-nav-add');
    	$(this).parent().parent().prev().addClass('wxnav-nav-add');
    	$(this).parent().remove();
    	// 判断二级菜单的数量，三角和加号是否显示
    	nav_b_num();
    	// 渲染当前选中菜单数据
		nav_dat_xiu();
    });
    // 选择菜单
    $(document).on('click','.wxnav-p',function(){
    	// 选择前菜单数据存储到html
		var now_dat = now_show_fun();
		if( now_dat.name == '' ){
			layer.msg("菜单名称不能为空",{time:1500});
			return false;
		}
		// 修改选择前菜单名称
		$('.wxnav-nav-add').attr("data-name",now_dat.name);
		$('.wxnav-nav-add').children('.wxnav-p').children('span').html(now_dat.name);
		// 选择前菜单数据存储在html里
		now_dat = JSON.stringify(now_dat);
		$('.wxnav-nav-add').attr("data-info",now_dat);
    	// 选择后选中效果
    	$('.wxnav-nav').removeClass('wxnav-nav-add');
    	$(this).parent().addClass('wxnav-nav-add');
    	// 选择后菜单数据渲染
		nav_dat_xiu();
    });
    // 保存按钮
	$(document).on('click','.navcon-foot-sure',function(){
		// 获取当前菜单类别
		var menu_id = $('.wxnav-nav-add').attr("data-id");
		var now_show_dat = now_show_fun();
		// 未输入标题
		if( now_show_dat.name == '' ){
			layer.msg("菜单名称不能为空",{time:1500});
			return false;
		}
		// 菜单名称是否超出
		var menu_name_num = $('.navcon-name').attr("data-num");
		var menu_name_txt = $('.navcon-name .p4').html();
		if( menu_name_num == 2 ){
			layer.msg(menu_name_txt,{time:1500});
			return false;
		}
		// 选择图文消息，未选择图文
		if( now_show_dat.id == 1 & now_show_dat.media_id == '' & menu_id == 1){
			layer.msg("图文内容不能为空",{time:1500});
			return false;
		}
		// 选择文字内容，未输入文字
		if( now_show_dat.id == 2 & now_show_dat.edit == '' & menu_id == 1 ){
			layer.msg("文字内容不能为空",{time:1500});
			return false;
		}
		// 选择图片内容，未选择图片
		if( now_show_dat.id == 3 & now_show_dat.media_id == '' & menu_id == 1 ){
			layer.msg("图片内容不能为空",{time:1500});
			return false;
		}
		// 选择语音内容，未选择语音
		if( now_show_dat.id == 4 & now_show_dat.media_id == '' & menu_id == 1 ){
			layer.msg("语音内容不能为空",{time:1500});
			return false;
		}
		// 选择关键词回复，未选择关键词
		if( now_show_dat.id == 5 & now_show_dat.key_id == '' & menu_id == 1 ){
			layer.msg("关键词回复不能为空",{time:1500});
			return false;
		}
		// 选择链接，未输入链接
		if( now_show_dat.id == 6 & now_show_dat.page_url == '' & menu_id == 1 ){
			layer.msg("页面地址不能为空",{time:1500});
			return false;
		}

		// 菜单数据保存到当前选中的html中
		// 菜单名称
		$('.wxnav-nav-add').attr("data-name",now_show_dat.name);
		$('.wxnav-nav-add .wxnav-p span').html(now_show_dat.name);
		// 菜单数据
		$('.wxnav-nav-add').attr("data-info",JSON.stringify(now_show_dat));
		// 获取当前所有菜单数据，判断是否有数据为空
		var true_or_false = all_nav_dat();
		if( true_or_false == 0 ){
			return false;
		}

		// 请求菜单保存接口
		var all_json = all_nav_json();
		// 保存自定义菜单接口
		xrequest({id:wechat_id,json:all_json},api_domain+'/apimember/wxmenu/saveMenu','post',true,function (result){
	  		result = typeof result === 'string' ? $.parseJSON(result) : result;
	  		if( result.code == 1 ){
	  			layer.msg("菜单保存成功",{time:1500});
	  		}else{
	  			layer.msg(result.msg,{time:1500});
	  		}
	  	});
	});
	// 发布按钮
	$(document).on('click','.navcon-foot-rele',function(){
		// 获取当前菜单类别
		var menu_id = $('.wxnav-nav-add').attr("data-id");
		var now_show_dat = now_show_fun();
		// 未输入标题
		if( now_show_dat.name == '' ){
			layer.msg("菜单名称不能为空",{time:1500});
			return false;
		}
		// 菜单名称是否超出
		var menu_name_num = $('.navcon-name').attr("data-num");
		var menu_name_txt = $('.navcon-name .p4').html();
		if( menu_name_num == 2 ){
			layer.msg(menu_name_txt,{time:1500});
			return false;
		}
		// 选择图文消息，未选择图文
		if( now_show_dat.id == 1 & now_show_dat.media_id == '' & menu_id == 1){
			layer.msg("图文内容不能为空",{time:1500});
			return false;
		}
		// 选择文字内容，未输入文字
		if( now_show_dat.id == 2 & now_show_dat.edit == '' & menu_id == 1 ){
			layer.msg("文字内容不能为空",{time:1500});
			return false;
		}
		// 选择图片内容，未选择图片
		if( now_show_dat.id == 3 & now_show_dat.media_id == '' & menu_id == 1 ){
			layer.msg("图片内容不能为空",{time:1500});
			return false;
		}
		// 选择语音内容，未选择语音
		if( now_show_dat.id == 4 & now_show_dat.media_id == '' & menu_id == 1 ){
			layer.msg("语音内容不能为空",{time:1500});
			return false;
		}
		// 选择关键词回复，未选择关键词
		if( now_show_dat.id == 5 & now_show_dat.key_id == '' & menu_id == 1 ){
			layer.msg("关键词回复不能为空",{time:1500});
			return false;
		}
		// 选择链接，未输入链接
		if( now_show_dat.id == 6 & now_show_dat.page_url == '' & menu_id == 1 ){
			layer.msg("页面地址不能为空",{time:1500});
			return false;
		}
		// 菜单数据保存到当前选中的html中
		// 菜单名称
		$('.wxnav-nav-add').attr("data-name",now_show_dat.name);
		$('.wxnav-nav-add .wxnav-p span').html(now_show_dat.name);
		// 菜单数据
		$('.wxnav-nav-add').attr("data-info",JSON.stringify(now_show_dat));
		// 获取当前所有菜单数据，判断是否有数据为空
		var true_or_false = all_nav_dat();
		if( true_or_false == 0 ){
			return false;
		}
		// 请求菜单保存接口
		var all_json = all_nav_json();
		// 保存自定义菜单接口
		xrequest({id:wechat_id,json:all_json},api_domain+'/apimember/wxmenu/menuPublish','post',true,function (result){
	  		result = typeof result === 'string' ? $.parseJSON(result) : result;
	  		if( result.code == 1 ){
	  			layer.msg("菜单发布成功",{time:1500});
	  		}else{
	  			layer.msg(result.msg,{time:1500});
	  		}
	  	});
	});
    // 渲染当前选中菜单数据
	function nav_dat_xiu(){
		// 获取当前菜单数据
		var menu_info =  $('.wxnav-nav-add').attr("data-info");
		if( menu_info == undefined ){
			console.log("暂无菜单")
			$('.nva-main').hide();
			$('.nva-none').show();
		}else{
			$('.nva-main').show();
			$('.nva-none').hide();
			// 获取当前菜单类型
			var menu_id = $('.wxnav-nav-add').attr("data-id");
			if( menu_id == 1 ){
				$('.navcon-body').show();
			}else{
				$('.navcon-body').hide();
			}
			// 获取当前菜单是一级还是二级,改变显示文字
			var menu_rank = $('.wxnav-nav-add').attr("data-tpye");
			if( menu_rank == 2 ){
				$('.navcon-name .p4').html("子菜单字数不超过20个汉字或40个字母");
			}else{
				$('.navcon-name .p4').html("主菜单字数不超过5个汉字或10个字母");
			};
			// json字符串转为json数组
			var data = typeof menu_info === 'string' ? $.parseJSON(menu_info) : menu_info;
			// 菜单名字
			$('.navcon-name .p2 input').val(data.name);
			// 菜单名字是否超出
			name_num();
			// 清空图文消息
			$('.navcon-act-chose').show();
			$('.navcon-act-show').hide().html('');
			// 清空文字
			layedit.setContent(newseditor,'');
			// 清空图片
			$('.navcon-img-chose').show();
			$('.navcon-img-show').hide().html('');
			// 清空语音
			$('.navcon-voc-chose').show();
			$('.navcon-voc-show').hide().html('');
			// 清空关键词
			$('.navcon-key-ul').html('');
			navcon_key_list(0);
			// 清空链接
			$('.navcon-url-iput input').val('');
			// 图文
			if( data.id == 1 ){
				$('.navcon-chose .d1 input').prop({checked:true});
				$('.navcon-chose .d2 input').prop({checked:false});
				$('.navcon-body').attr("data-type",1);
				$('.navcon-type').show().attr("data-id",1);
				$('.navcon-url').hide();
				$('.navcon-nav li').eq(0).addClass('navcon-nav-add').siblings().removeClass('navcon-nav-add');
				$('.navcon-act').show().siblings().hide();
				if( data.media_id == '' ){
					$('.navcon-act-chose').show();
					$('.navcon-act-show').hide();
				}else{
					var  act_html = '<div class="wxword-act">'+
										'<div class="art-sole" data-id="'+data.media_id+'" data-url="'+data.act_url+'" data-dec="'+data.act_dec+'"'+
										'data-name="'+data.act_name+'" data-img="'+data.act_img+'">'+
											'<p class="art-sole-tit">'+data.act_name+'</p>'+
											'<p class="art-sole-img" style="background-image:url('+data.act_img+');" data-id="'+data.media_id+'"></p>'+
											'<p class="art-sole-ary"></p>'+
											'<a class="art-lnk" href="'+data.act_url+'" target="_blank"><span>预览文章</span></a>'+
										'</div></div><div class="navcon-act-del">删除</div>'
					$('.navcon-act-chose').hide();
					$('.navcon-act-show').show().html(act_html);
				}
			}
			// 文字
			if( data.id == 2 ){
				$('.navcon-chose .d1 input').prop({checked:true});
				$('.navcon-chose .d2 input').prop({checked:false});
				$('.navcon-body').attr("data-type",2);
				$('.navcon-type').show().attr("data-id",2);
				$('.navcon-url').hide();
				$('.navcon-nav li').eq(1).addClass('navcon-nav-add').siblings().removeClass('navcon-nav-add');
				$('.navcon-txt').show().siblings().hide();
				layedit.setContent(newseditor,data.edit);
				menutxtnums(data.edit);
			}
			// 图片
			if( data.id == 3 ){
				$('.navcon-chose .d1 input').prop({checked:true});
				$('.navcon-chose .d2 input').prop({checked:false});
				$('.navcon-body').attr("data-type",3);
				$('.navcon-type').show().attr("data-id",3);
				$('.navcon-url').hide();
				$('.navcon-nav li').eq(2).addClass('navcon-nav-add').siblings().removeClass('navcon-nav-add');
				$('.navcon-img').show().siblings().hide();
				if( data.media_id == '' ){
					$('.navcon-img-chose').show();
					$('.navcon-img-show').hide();
				}else{
					var img_html = 	'<p class="showod-img"><img src="'+data.img_url+'" data-id="'+data.media_id+'">'+
									'<span class="navcon-img-sel"><i class="fa fa-retweet"></i>替换素材</span></p>'
					$('.navcon-img-chose').hide();
					$('.navcon-img-show').show().html(img_html);
				}
			}
			// 语音
			if( data.id == 4 ){
				$('.navcon-chose .d1 input').prop({checked:true});
				$('.navcon-chose .d2 input').prop({checked:false});
				$('.navcon-body').attr("data-type",4);
				$('.navcon-type').show().attr("data-id",4);
				$('.navcon-url').hide();
				$('.navcon-nav li').eq(3).addClass('navcon-nav-add').siblings().removeClass('navcon-nav-add');
				$('.navcon-voc').show().siblings().hide();
				if( data.media_id == '' ){
					$('.navcon-voc-chose').show();
					$('.navcon-voc-show').hide();
				}else{
					var voc_html = 	'<div class="voice-main" '+
										'data-id="'+data.media_id+'" data-url="'+data.voc_url+'" data-min="'+data.voc_min+'" data-sec="'+data.voc_sec+'">'+
										'<div class="voice-main-left">'+
											'<i class="auto-cicon23"></i>'+
											'<img src="../../static/images/music_audio.gif" style="display:none;">'+
										'</div>'+
										'<div class="voice-main-right">'+
											'<p class="c-hide1">'+data.voc_name+'</p>'+
											'<p></p>'+
											'<p><span class="voice-main-time1">'+data.voc_min+'</span><span class="voice-main-time2" style="display:none;">00:00</span></p>'+
										'</div>'+
										'<audio src="" class="wxnews-play"></audio>'+
										'<span class="navcon-voc-sel"><i class="fa fa-retweet"></i>替换素材</span>'+
										'<p></p>'+
									'</div>'
					$('.navcon-voc-chose').hide();
					$('.navcon-voc-show').show().html(voc_html);
				}
			}
			// 关键词
			if( data.id == 5 ){
				$('.navcon-chose .d1 input').prop({checked:true});
				$('.navcon-chose .d2 input').prop({checked:false});
				$('.navcon-body').attr("data-type",5);
				$('.navcon-type').show().attr("data-id",5);
				$('.navcon-url').hide();
				$('.navcon-nav li').eq(4).addClass('navcon-nav-add').siblings().removeClass('navcon-nav-add');
				$('.navcon-key').show().siblings().hide();
				$('.navcon-key').attr("data-key",data.key_id);
				navcon_key_list(0)
			}
			// 外链
			if( data.id == 6 ){
				$('.navcon-chose .d1 input').prop({checked:false});
				$('.navcon-chose .d2 input').prop({checked:true});
				$('.navcon-body').attr("data-type",6);
				$('.navcon-type').hide().attr("data-id",1);
				$('.navcon-url').show();
				$('.navcon-nav li').eq(0).addClass('navcon-nav-add').siblings().removeClass('navcon-nav-add');
				$('.navcon-act').show().siblings().hide();
				$('.navcon-url-iput input').val(data.page_url);
			}
		}
		form.render();
	}
	// 获取当前内容数据
	function now_show_fun(){
		// 当前内容数据
		var now_show_info = {}
		// 当前菜单类型
		var menu_id = $('.wxnav-nav-add').attr("data-id");
		// 获取当前菜单名称
		var menu_name = $('.navcon-name .p2 input').val();
		now_show_info.name = menu_name;
		// 菜单内容选择类型
		var menu_type = $('.navcon-body').attr("data-type");
		// 图文类型
		if( menu_type == 1 ){
			now_show_info.content_type = "news";
			now_show_info.id = "1";
			if( $('.art-sole').attr("data-id") == undefined ){
				now_show_info.media_id = '';
				now_show_info.act_url = '';
				now_show_info.act_name = '';
				now_show_info.act_img = '';
				now_show_info.act_dec = '';
			}else{
				now_show_info.media_id = $('.art-sole').attr("data-id");
				now_show_info.act_url = $('.art-sole').attr("data-url");
				now_show_info.act_name = $('.art-sole').attr("data-name");
				now_show_info.act_img = $('.art-sole').attr("data-img");
				now_show_info.act_dec = $('.art-sole').attr("data-dec");
			}
		};
		// 文字类型
		if( menu_type == 2 ){
			now_show_info.content_type = "text";
			now_show_info.id = "2";
			var editor_text = layedit.getText(newseditor);
			if( editor_text == '' ){
				now_show_info.edit = '';
			}else{
				now_show_info.edit = editor_text;
			}
		}
		// 图片类型
		if( menu_type == 3 ){
			now_show_info.content_type = "image";
			now_show_info.id = "3";
			// 图片链接
			var img_url = $('.showod-img img').attr("src");
			// 图片ID
			var media_id = $('.showod-img img').attr("data-id");
			if( media_id == undefined ){
				now_show_info.media_id = '';
				now_show_info.img_url = '';
			}else{
				now_show_info.media_id = media_id;
				now_show_info.img_url = img_url;
			}
		}
		// 语音类型
		if( menu_type == 4 ){
			now_show_info.content_type = "voice";
			now_show_info.id = "4";
			// 语音ID
			var media_id = $('.voice-main').attr("data-id");
			// 语音分钟
			var voc_min = $('.voice-main').attr("data-min");
			// 语音秒
			var voc_sec = $('.voice-main').attr("data-sec");
			// 语音名称
			var voc_name = $('.voice-main-right .c-hide1').html();
			// 语音链接
			var voc_url = $('.voice-main').attr("data-url");
			if( media_id == undefined ){
				now_show_info.media_id = '';
				now_show_info.voc_min = '';
				now_show_info.voc_sec = '';
				now_show_info.voc_name = '';
				now_show_info.voc_url = '';
			}else{
				now_show_info.media_id = media_id;
				now_show_info.voc_min = voc_min;
				now_show_info.voc_sec = voc_sec;
				now_show_info.voc_name = voc_name;
				now_show_info.voc_url = voc_url;
			}
		}
		// 关键字
		if( menu_type == 5 ){
			now_show_info.content_type = "keywords";
			now_show_info.id = "5";
			// 获取关键字ID
			var key_id = $('.navcon-key-li-add').attr("data-id");
			if( key_id == undefined ){
				now_show_info.key_id = '';
			}else{
				now_show_info.key_id = key_id;
			}
		}
		// 跳转网页
		if( menu_type == 6 ){
			now_show_info.content_type = "view";
			now_show_info.id = "6";
			// 页面链接
			var page_url = $('.navcon-url-iput input').val();
			if( page_url == '' ){
				now_show_info.page_url = '';
			}else{
				now_show_info.page_url = page_url;
			}
		}
		return now_show_info;
	}
	// 获取当前所有菜单数据，判断是否有数据为空
	function all_nav_dat(){
		var true_or_false = 0;
		// 遍历所有菜单
		$.each($('.wxnav-nav'),function(a,all){
			// 获取当前菜单的内容
			var menu_id = $(all).attr("data-id");
			// 获取当前菜单的数据
			var menu_info = $(all).attr("data-info");
			// 获取当前菜单名称
			var nav_name_num = $(all).attr("data-name").getBytes();
			// 获取当前菜单等级
			var nav_type_rank =	$(all).attr("data-tpye");
			// 判断主菜单名称是否超出
			if(  nav_type_rank == 1 & nav_name_num > 10 ){
				$('.wxnav-nav').removeClass('wxnav-nav-add');
				$(all).addClass('wxnav-nav-add');
				nav_dat_xiu(menu_info);
				layer.msg("主菜单字数不超过5个汉字或10个字母",{time:1500});
				true_or_false = 0;
				return false;
			}
			// 判断子菜单名称是否超出
			if(  nav_type_rank == 2 & nav_name_num > 40 ){
				$('.wxnav-nav').removeClass('wxnav-nav-add');
				$(all).addClass('wxnav-nav-add');
				nav_dat_xiu(menu_info);
				layer.msg("子菜单字数不超过20个汉字或40个字母",{time:1500});
				true_or_false = 0;
				return false;
			}
			if( menu_id == 1 ){
				var info = typeof menu_info === 'string' ? $.parseJSON(menu_info) : menu_info;

				// 图文
				if( info.id == 1 & info.media_id == '' ){
					layer.msg("图文内容不能为空",{time:1500});
					$('.wxnav-nav').removeClass('wxnav-nav-add');
					$(all).addClass('wxnav-nav-add');
					nav_dat_xiu(menu_info);
					true_or_false = 0;
					return false;
				}
				// 文字
				if( info.id == 2 & info.edit == '' ){
					layer.msg("文字内容不能为空",{time:1500});
					$('.wxnav-nav').removeClass('wxnav-nav-add');
					$(all).addClass('wxnav-nav-add');
					nav_dat_xiu(menu_info);
					true_or_false = 0;
					return false;
				}
				// 文字字数是否超出
				if( info.id == 2 ){
					if( info.edit.length > 230 ){
						layer.msg("文字字数超出限制",{time:1500});
						$('.wxnav-nav').removeClass('wxnav-nav-add');
						$(all).addClass('wxnav-nav-add');
						nav_dat_xiu(menu_info);
						true_or_false = 0;
						return false;
					}
				}
				// 图片
				if( info.id == 3 & info.media_id == '' ){
					layer.msg("图片内容不能为空",{time:1500});
					$('.wxnav-nav').removeClass('wxnav-nav-add');
					$(all).addClass('wxnav-nav-add');
					nav_dat_xiu(menu_info);
					true_or_false = 0;
					return false;
				}
				// 语音
				if( info.id == 4 & info.media_id == '' ){
					layer.msg("语音内容不能为空",{time:1500});
					$('.wxnav-nav').removeClass('wxnav-nav-add');
					$(all).addClass('wxnav-nav-add');
					nav_dat_xiu(menu_info);
					true_or_false = 0;
					return false;
				}
				// 关键词
				if( info.id == 5 & info.key_id == '' ){
					layer.msg("关键词不能为空",{time:1500});
					$('.wxnav-nav').removeClass('wxnav-nav-add');
					$(all).addClass('wxnav-nav-add');
					nav_dat_xiu(menu_info);
					true_or_false = 0;
					return false;
				}
				// 页面地址
				if( info.id == 6 & info.page_url == '' ){
					layer.msg("页面地址不能为空",{time:1500});
					$('.wxnav-nav').removeClass('wxnav-nav-add');
					$(all).addClass('wxnav-nav-add');
					nav_dat_xiu(menu_info);
					true_or_false = 0;
					return false;
				}
				true_or_false = 1
			}
		});
		return true_or_false;
	};
	// 当菜单数据不为空时，获取获取所有菜单数据
	function all_nav_json(){
		var all_json = []
		$.each($('.wxnav-one'),function(j,jso){
			// 当前主菜单+子菜单数据
			var one_json = {};
			// 当前子菜单数据
			var son_json = [];
			// 获取一级菜单类型
			var menu_id = $(jso).find('.wxnav-a').attr("data-id");
			// 获取一级菜单数据
			var menu_a_dat = $(jso).find('.wxnav-a').attr("data-info");
			menu_a_dat = typeof menu_a_dat === 'string' ? $.parseJSON(menu_a_dat) : menu_a_dat;
			// 获取当前耳机菜单数据
			$.each($(jso).find('.wxnav-b'),function(b,bjso){
				// 获取二级菜单数据
				var menu_b_dat = $(bjso).attr("data-info");
				menu_b_dat = typeof menu_b_dat === 'string' ? $.parseJSON(menu_b_dat) : menu_b_dat;
				son_json.push(menu_b_dat);
			});
			if( menu_id == 2 ){
				one_json.name = menu_a_dat.name;
				one_json.sub_button = son_json;
				one_json.info = menu_a_dat
				all_json.push(one_json)
			}else{
				all_json.push(menu_a_dat);
			}
		});
		return all_json;
	}
	// 当前内容数据选择类型
    $(document).on('click','.navcon-nav li',function(){
    	// 当前内容菜单下标
    	var int = $(this).index();
    	// 选中当前
    	$(this).addClass('navcon-nav-add').siblings().removeClass('navcon-nav-add');
    	// 当前显示
    	$('.navcon-con li').eq(int).show().siblings().hide();
    	// 菜单类型ID
    	$('.navcon-body').attr("data-type",int+1);
    });
	// 选择发送消息
    form.on('radio(navcon-radio1)', function(data){
    	$('.navcon-type').show();
    	$('.navcon-url').hide();
    	$('.navcon-body').attr("data-type",$('.navcon-type').attr("data-id"));
	});
	// 选择跳转网页
	form.on('radio(navcon-radio2)', function(data){
		$('.navcon-type').hide();
    	$('.navcon-url').show();
    	$('.navcon-body').attr("data-type",6);
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
	// 选择微信图文
    $(document).on('click','.navcon-act-chose-pop',function(){
    	wxart(3,$(this).parent());
    })
    // 删除微信图文
    $(document).on('click','.navcon-act-del',function(){
    	$(this).parent().prev().show();
    	$(this).parent().hide().html('');
    });
	// 选择微信图片
	$(document).on('click','.navcon-img-left',function(){
		wximg(5,$(this).parent());
	});
	// 替换微信图片
	$(document).on('click','.navcon-img-sel',function(){
		wximg(5,$(this).parent().parent().prev());
	});
	// 上传图片
    var uploadInst = upload.render({
	    elem: '.navcon-img-right' //绑定元素
	    ,url:'/apimember/wxstyle/upLoadStyle' //上传接口
	    ,accept: 'images'
	    ,acceptMime: 'image/bmp,image/png,image/jpg,image/jpeg,image/gif'
	    ,size:2048
	    ,data: {"id":wechat_id,"type":"image",token:localStorage.getItem('token')}
	    // 上传前回调
	    ,before: function(obj){
		     layer.load(2,{shade: [0.1,'#fff']});//加载中
		  }
		// 上传后回调
	    ,done: function(res,index,upload){
	      	if( res.code == 1 ){
				layer.closeAll('loading');
				$('.navcon-img-chose').hide();
				var urlImg = '<p class="showod-img"><img src="'+ res.data.url +'" data-id="'+ res.data.media_id +'">'+
							'<span class="navcon-img-sel"><i class="fa fa-retweet"></i>替换素材</span></p>'
				$('.navcon-img-show').show().html(urlImg);
			}else{
				layer.closeAll('loading');
				layer.msg(res.msg,{time:1500})
			}
	    }
	    // 上传报错
	    ,error: function(){
	    	layer.closeAll('loading');
	      	layer.msg("服务器连接失败");
	    }
	});
	// 选择语音
	$(document).on('click','.navcon-voc-left',function(){
		wxvoice(5,$(this).parent())
	});
	// 替换语音
	$(document).on('click','.navcon-voc-sel',function(){
		wxvoice(5,$(this).parent().parent().prev());
	});
	// 上传语音
	var uploadInst = upload.render({
	    elem: '.navcon-voc-right' //绑定元素
	    ,url:'/apimember/wxstyle/upLoadStyle' //上传接口
	    ,accept: 'audio'
	    ,acceptMime: 'audio/mp3,audio/wma,audio/wav,audio/amr'
	    ,data: {"id":wechat_id,"type":"voice",token:localStorage.getItem('token')}
	    ,size:2048
	    // 上传前回调
	    ,before: function(obj){
		     layer.load(2,{shade: [0.1,'#fff']});//加载中
		  }
		// 上传后回调
	    ,done: function(res,index,upload){
	      	if( res.code == 1 ){
	      		layer.closeAll('loading');//关闭
	      		// 获取分钟
				var min = Math.floor(res.data.times / 60);
				// 获取剩余秒
				var sec = Math.ceil(res.data.times % 60);
				// 分钟数小于10前面加0
				if( min<10 ){
					min = '0'+min
				}
				var voc_time = min+':'+sec;
				var secs = Math.ceil(res.data.times);
	      		var voice_html ='<div class="voice-main" data-id="'+res.data.media_id+'" data-url="" data-min="'+voc_time+'" data-sec="'+secs+'">'+
								'<div class="voice-main-left">'+
									'<i class="auto-cicon23"></i>'+
									'<img src="../../static/images/music_audio.gif" style="display:none;">'+
								'</div>'+
								'<div class="voice-main-right">'+
									'<p class="c-hide1">'+res.data.filename+'</p>'+
									'<p></p>'+
									'<p><span class="voice-main-time1">'+voc_time+'</span><span class="voice-main-time2" style="display:none;">00:00</span></p>'+
								'</div>'+
								'<audio src="" class="wxnews-play"></audio>'+
								'<span class="navcon-voc-sel"><i class="fa fa-retweet"></i>替换素材</span></p>'
							'</div>'
				$('.navcon-voc-chose').hide();
	      		$('.navcon-voc-show').show().html(voice_html);
			}else{
				layer.closeAll('loading');
				layer.msg(res.msg,{time:1500});
			}
			form.render("radio");
	    }
	    // 上传报错
	    ,error: function(){
	    	layer.closeAll('loading');
	      	layer.msg("服务器连接失败");
	    }
	});
	// 关键词回复列表选择
	$(document).on('click','.navcon-key-li',function(){
		$(this).addClass('navcon-key-li-add').siblings().removeClass('navcon-key-li-add');
	});
	// 关键词分组
	$(function(){
		xrequest({id:wechat_id},api_domain+'/apimember/wxreply/getGroups','post',false,function (result){
	  		result = typeof result === 'string' ? $.parseJSON(result) : result;
	  		if( result.code == 1 ){
	  			var dat = result.data
	  			var int1 = 	'<option value="-1">全部</option><option value="0">未分组</option>';
	  			var inta = '';
	  			for( var i=0;i<dat.length;i++ ){
	  				inta+= '<option value="'+dat[i].id+'">'+dat[i].name+'</option>'
	  			};
	  			$('.navcon-key-sel').html(int1+inta);

	  		}else{
	  			layer.msg(result.msg,{time:1500});
	  		}
		  	form.render();
	  	});
	});
	// 选择分组
	form.on('select(navcon-key-select)', function(data){
	  	navcon_key_list(data.value);
	});
	// 关键词列表数据渲染
	navcon_key_list(0);
	function navcon_key_list(id){
		// 数据渲染
		flow.load({
			//指定列表容器
		    elem: '.navcon-key-ul'
		    ,scrollElem: '.navcon-key-ul'
		    ,isAuto:true
		    ,end:"已显示全部关键字"
		    ,mb:50
		    //到达临界点（默认滚动触发），触发下一页
		    ,done: function(page, next){
		    	xrequest({id:wechat_id,group_id:id,page:page,limit:6},api_domain+'/apimember/wxreply/getKeywords','post',true,function (result){
			  		result = typeof result === 'string' ? $.parseJSON(result) : result;
			  		$.each(result.data,function(k,item){
						// 内容部分转换成json
						item.content = typeof item.content === 'string' ? $.parseJSON(item.content) : item.content;
						// 关键字转换成json
						item.keyword = typeof item.keyword === 'string' ? $.parseJSON(item.keyword) : item.keyword;
						// 回复内容文字
						result.data[k].num_txt = ''
						var img_num = 0;
						var voc_num = 0;
						var art_num = 0;
						var txt_num = 0;
						var num_txt = ''
						$.each(item.content,function(key,con){
							if(con.type === 'image') img_num ++;
							if(con.type === 'voice') voc_num ++;
							if(con.type === 'news') art_num ++;
							if(con.type === 'text') txt_num ++;
						});
						if( art_num == 0 ){num_txt+=''}else{num_txt+=art_num+"图文 "};
						if( txt_num == 0 ){num_txt+=''}else{num_txt+=txt_num+"文本 "};
						if( img_num == 0 ){num_txt+=''}else{num_txt+=img_num+"图片 "};
						if( voc_num == 0 ){num_txt+=''}else{num_txt+=voc_num+"语音 "};
						result.data[k].num_txt = num_txt;
						// 关键词
						result.data[k].key_html = '';
						var key_html = ''
						$.each(item.keyword,function(i,dat){
							key_html += ' '+dat.title
						});
						result.data[k].key_html = key_html
					});
			  		if( result.code == 1 ){
			  			laytpl($('#navcon-key-html').html()).render(result.data, function(html){
			  				if( result.count == 0 ){
			  					$('.navcon-key-ul').hide();
			  					$('.navcon-key-none').show();
			  				}else{
			  					$('.navcon-key-ul').show();
			  					$('.navcon-key-none').hide();
			  				}
			  				next(html, page < result.count/6);
						});

			  			$.each($('.navcon-key-li'),function(s,sem){
			  				// 当前选中关键词	ID
							var key_id = $('.navcon-key').attr("data-key");
		  					var key_this_id = $(sem).attr("data-id");
		  					if( key_id == key_this_id ){
		  						$(sem).addClass('navcon-key-li-add')
		  					}
			  			})
			  			
			  		}else{
			  			layer.msg(result.msg,{time:1500});
			  		}
			  	},100);
		    }
		});	
	}
	// 选择图文链接弹窗
	$(document).on('click','.navcon-url-tips',function(){
		layer.open({
	        title: ['选择图文', 'font-size:16px;text-align:center;color:#6098ee;'],
	        type:2,
	        skin: 'layui-layer-new', 
	        area: ['910px','600px'], 
	        move: false,
	        closeBtn:2,
	        shade: 0.6,
	        shadeClose:false,
	        btn: ['取消','确定'],
	        content:'../wxcommon/wxgraphic.html',   
	        scrollbar: false,
	        btn2: function(index, layero){
			    var body = layer.getChildFrame('body', index);
			    var wordurl = body.find('.pop-p-add').children('.art-sole').attr("data-url");
			    if( wordurl == undefined ){
			    	layer.msg("请选择图文");
			    	return false;
			    }else{
			    	$('.navcon-url-iput input').val(wordurl);
			    }
			}
	    });
	});






	// 微信表情
	// 点击显示表情
	$(document).on('click','.navcon-name .p3',function(ev){
		ev.stopPropagation();
		$('.emiges').show();
	});
	// 点击隐藏表情
    $(document).on('click','body',function(){
    	$('.emiges').hide();
    });
	// 获取微信表情数据
	var emiges_dat
	$.ajax({
        'url': '../../static/js/wxmenu/emoji.json',
        'type': 'get',
        "async": false,
        success: function (result){
        	emiges_dat = result
        	var emiges_nav = ''
        	$.each(result,function(i,item){
        		// 渲染导航菜单
        		emiges_nav += '<li title="'+i+'" class=""><span>'+i+'</span></li>';
        		laytpl($('#emiges-html').html()).render(item, function(html){
					$('.emiges-main-before').before(html)
				});
        	});
        	$('.emiges-nav-ul li').eq(0).after(emiges_nav);
        }
    });
    // 微信表情切换菜单
    $(document).on('click','.emiges-nav-ul li',function(ev){
    	ev.stopPropagation();
    	var int = $(this).index();
    	var margin = isNaN(parseInt($(".emiges-nav-ul").css("left"))) ? 0 : Math.abs(parseInt($(".emiges-nav-ul").css("left")));
        if ((margin / 58 + 4)  == int){
            $(".emiges-nav-next").click();
            $(".emiges-nav-next").click();
        }
        if ((margin / 58)  == int){
            $(".emiges-nav-prev").click();
            $(".emiges-nav-prev").click();
        }
    	$(this).addClass('emiges-nav-add').siblings().removeClass('emiges-nav-add');
    	$('.emiges-main').children().hide();
    	$('.emiges-main').children().eq(int).show();
    });
    // 点击上一个
    $(document).on('click','.emiges-nav-prev',function(ev){
    	ev.stopPropagation();
    	var left = parseInt($(".emiges-nav-ul").css("left"));
        if(left >= 0){
            return false;
        }
        $(".emiges-nav-ul").css("left",parseInt($(".emiges-nav-ul").css("left")) + 58 + "px");
    });
    // 点击下一个
    $(document).on('click','.emiges-nav-next',function(ev){
    	ev.stopPropagation();
    	var left = parseInt($(".emiges-nav-ul").css("left"));
        if( left < - 522 ){
            return false;
        }
        $(".emiges-nav-ul").css("left",parseInt($(".emiges-nav-ul").css("left")) - 58 + "px");
    });
    // 点击表情插入到菜单名称
    $(document).on('click','.emiges-main-li',function(){
    	var obj = $(".navcon-name .p2 input")[0];
	    var text = $(this).data("value");
    	insertAtCaret(obj,text);
    })
    //在文本框光标处插入
    function insertAtCaret(textObj, textFeildValue){
        if (document.all) {
            if (textObj.createTextRange && textObj.caretPos) {
                var caretPos = textObj.caretPos;
                caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? textFeildValue + ' ' : textFeildValue;
            } else {
                textObj.value = textFeildValue;
            }
        } else {
            if (textObj.setSelectionRange) {
                var rangeStart = textObj.selectionStart;
                var rangeEnd = textObj.selectionEnd;
                var tempStr1 = textObj.value.substring(0, rangeStart);
                var tempStr2 = textObj.value.substring(rangeEnd);
                textObj.value = tempStr1 + textFeildValue + tempStr2;
            } else {
                alert("This version of Mozilla based browser does not support setSelectionRange");
            }
        }
    }
    //获取字符串长度 ：中文长度为2
	String.prototype.getBytes = function () {
	    var cArr = this.match(/[^\x00-\xff]/ig);
	    return this.length + (cArr == null ? 0 : cArr.length);
	};
    $(document).on('input', '.navcon-name .p2 input', function (){
    	name_num();
	});
    // 获取菜单名称长度，判断是否超了
    function name_num(){
    	// 当前菜单是一级菜单还是二级菜单
    	var menu_type = $('.wxnav-nav-add').attr("data-tpye");
    	// 当前菜单内容长度
    	var name_num = $('.navcon-name .p2 input').val().getBytes();
    	if( menu_type == 1 ){
    		if( name_num > 10 ){
    			$('.navcon-name .p4').css("color","#ff5439");
    			$('.navcon-name').attr("data-num",2);
    		}else{
    			$('.navcon-name .p4').css("color","#aaaaaa");
    			$('.navcon-name').attr("data-num",1);
    		}
    	}else{
    		if( name_num > 40 ){
    			$('.navcon-name .p4').css("color","#ff5439");
    			$('.navcon-name').attr("data-num",2);
    		}else{
    			$('.navcon-name .p4').css("color","#aaaaaa");
    			$('.navcon-name').attr("data-num",1);
    		}
    	}
    }





   	// 手机预览
    // 点击预览按钮
    $(document).on('click','.nav-view',function(){
    	// 选择前菜单数据存储到html
		var now_dat = now_show_fun();
		if( now_dat.name == '' ){
			layer.msg("菜单名称不能为空",{time:1500});
			return false;
		}
		// 修改选择前菜单名称
		$('.wxnav-nav-add').attr("data-name",now_dat.name);
		$('.wxnav-nav-add').children('.wxnav-p').children('span').html(now_dat.name);
		// 数据转换成字符串
		now_dat = JSON.stringify(now_dat);
		$('.wxnav-nav-add').attr("data-info",now_dat);

    	// 获取当前菜单数据
    	var pho_json = []
		$.each($('.wxnav-one'),function(j,jso){
			// 当前主菜单+子菜单数据
			var one_json = {};
			// 当前子菜单数据
			var son_json = [];
			// 获取一级菜单类型
			var menu_id = $(jso).find('.wxnav-a').attr("data-id");
			// 获取一级菜单数据
			var menu_a_dat = $(jso).find('.wxnav-a').attr("data-info");
			menu_a_dat = typeof menu_a_dat === 'string' ? $.parseJSON(menu_a_dat) : menu_a_dat;
			// 获取当前耳机菜单数据
			$.each($(jso).find('.wxnav-b'),function(b,bjso){
				// 获取二级菜单数据
				var menu_b_dat = $(bjso).attr("data-info");
				menu_b_dat = typeof menu_b_dat === 'string' ? $.parseJSON(menu_b_dat) : menu_b_dat;
				son_json.push(menu_b_dat);
			});
			if( menu_id == 2 ){
				one_json.name = menu_a_dat.name;
				one_json.sub_button = son_json;
				one_json.info = menu_a_dat
				pho_json.push(one_json)
			}else{
				pho_json.push(menu_a_dat);
			}
		});
		// 渲染手机端数据
		laytpl($('#phone-html').html()).render(pho_json, function(html){
		 	$('.phone-nav').html(html);
		});
		// 显示预览手机
		$('.phone-bg').show();
    });
    // 点击手机预览菜单出现内容
    $(document).on('click','.phone-nav-list',function(){
    	// 获取当前菜单数据
    	var pho_info = $(this).attr("data-info");
    	// 如果没有数据
    	if( pho_info == '' ){
    		return false;
    	}
    	pho_info = typeof pho_info === 'string' ? $.parseJSON(pho_info) : pho_info;
    	// 文字
    	if( pho_info.content_type == "text" ){
    		if( pho_info.edit == '' ){
    			layer.msg("菜单未添加内容",{time:1500});
    			return false;
    		}else{
    			var pho_txt_html = 	'<div class="phone-txt">'+
										'<p class="phone-log-p"><img src="../../static/images/phonelogo.png"></p>'+
										'<p class="phone-san-p"></p>'+
										'<p class="phone-txt-p">'+pho_info.edit+'</p>'+
										'<p class="c-lear"></p>'+
									'</div>'
				$('.phone-before').before(pho_txt_html);
    		}
    	}
    	// 语音
    	if( pho_info.content_type == "voice" ){
    		if( pho_info.media_id == '' ){
    			layer.msg("菜单未添加内容",{time:1500});
    			return false;
    		}else{
    			var pho_voc_html = 	'<div class="phone-voc">'+
										'<p class="phone-log-p"><img src="../../static/images/phonelogo.png"></p>'+
										'<p class="phone-san-p"></p>'+
										'<p class="phone-voc-p"><i class="fa fa-rss"></i>'+pho_info.voc_sec+' "</p>'+
										'<p class="c-lear"></p>'+
									'</div>'
				$('.phone-before').before(pho_voc_html);
    		}
    	}
    	// 图片
    	if( pho_info.content_type == "image" ){
    		if( pho_info.media_id == '' ){
    			layer.msg("菜单未添加内容",{time:1500});
    			return false;
    		}else{
    			var pho_img_html = 	'<div class="phone-img">'+
										'<p class="phone-log-p"><img src="../../static/images/phonelogo.png"></p>'+
										'<p class="phone-img-p"><img src="'+pho_info.img_url+'"></p>'+
										'<p class="c-lear"></p>'+
									'</div>'
				$('.phone-before').before(pho_img_html);
    		}
    	}
    	// 图文
    	if( pho_info.content_type == "news" ){
    		if( pho_info.media_id == '' ){
    			layer.msg("菜单未添加内容",{time:1500});
    			return false;
    		}else{
    			var pho_act_html = 	'<div class="phone-act">'+
										'<p class="phone-act-p1" style="background-image:url('+pho_info.act_img+');"></p>'+
										'<p class="phone-act-p2">'+pho_info.act_name+'</p>'+
										'<p class="phone-act-p3">'+pho_info.act_dec+'</p>'+
										'<a href="'+pho_info.act_url+'" class="phone-act-a" target="_blank"><span>预览文章</span></a>'+
									'</div>'
				$('.phone-before').before(pho_act_html);
    		}
    	}
    	// 跳转网页
    	if( pho_info.content_type == "view" ){
    		if( pho_info.page_url == '' ){
    			layer.msg("菜单未添加内容",{time:1500});
    			return false;
    		}else{
    			window.open(pho_info.page_url);
    		}
    	}
    	// 关键字
    	if( pho_info.content_type == "keywords" ){
    		if( pho_info.key_id == '' ){
    			layer.msg("菜单未添加内容",{time:1500});
    			return false;
    		}else{
		 		xrequest({id:wechat_id,keywords_id:77},api_domain+'/apimember/wxmenu/keywordsId','post',true,function (result){
			  		result = typeof result === 'string' ? $.parseJSON(result) : result;
			  		if( result.code == 1 ){
			  			var data = result.data;
			  			$.each(data,function(i,item){
			  				// 文字
			  				if( item.type == 'text' ){
			  					var key_html = 	'<div class="phone-txt">'+
													'<p class="phone-log-p"><img src="../../static/images/phonelogo.png"></p>'+
													'<p class="phone-san-p"></p>'+
													'<p class="phone-txt-p">'+item.text+'</p>'+
													'<p class="c-lear"></p>'+
												'</div>'
								$('.phone-before').before(key_html);
			  				}
			  				// 图片
			  				if( item.type == 'image' ){
			  					var key_html = 	'<div class="phone-img">'+
													'<p class="phone-log-p"><img src="../../static/images/phonelogo.png"></p>'+
													'<p class="phone-img-p"><img src="'+item.url+'"></p>'+
													'<p class="c-lear"></p>'+
												'</div>'
			  					$('.phone-before').before(key_html);
			  				}
			  				// 语音
			  				if( item.type == 'voice' ){
			  					var key_html = 	'<div class="phone-voc">'+
													'<p class="phone-log-p"><img src="../../static/images/phonelogo.png"></p>'+
													'<p class="phone-san-p"></p>'+
													'<p class="phone-voc-p"><i class="fa fa-rss"></i>'+item.times+' "</p>'+
													'<p class="c-lear"></p>'+
												'</div>'
			  					$('.phone-before').before(key_html);
			  				}
			  				// 图文
			  				if( item.type == 'news' ){
			  					var key_html = 	'<div class="phone-act">'+
													'<p class="phone-act-p1" style="background-image:url('+item.cover_url+');"></p>'+
													'<p class="phone-act-p2">'+item.name+'</p>'+
													'<p class="phone-act-p3">'+item.desc+'</p>'+
													'<a href="'+item.url+'" class="phone-act-a" target="_blank"><span>预览文章</span></a>'+
												'</div>'
								$('.phone-before').before(key_html);
			  				}
			  			});
			  			$(".phone-body").scrollTop($(".phone-body")[0].scrollHeight);
			  		}else{
			  			layer.msg(result.msg,{time:1500});
			  		}
			  	});
    		}
    	}
    	$(".phone-body").scrollTop($(".phone-body")[0].scrollHeight);
    });
	
	// 退出预览
	$(document).on('click','.phone-quit',function(){
		$('.phone-bg').hide();
		var pho_none_html = '<p class="phone-before"></p>';
		$('.phone-body').html(pho_none_html);
	});

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



	// 保存时间、发布时间
	function menu_time(dat){
		// 最后保存时间
		if( dat.update_time == 0 || dat.update_time == undefined || dat.update_time == '' || dat.update_time== null ){
			$('.navcon-time .sp3').html("暂未发布")
		}else{
			$('.navcon-time .sp3').html(timetrans(dat.update_time))
		}
		// 最后发布时间
		if( dat.publish_time == 0 || dat.publish_time == undefined || dat.publish_time == '' || dat.publish_time == null ){
			$('.navcon-time .sp6').html("暂未保存");
		}else{
			$('.navcon-time .sp6').html(timetrans(dat.publish_time));
		}
	}

	// 当公众号没有自定义菜单时
	$(document).on('click','.nva-none-right .btn',function(){
		$('.nva-main').show();
		$('.nva-none').hide();
		$('.wxmenu-all span').click();
	});

});