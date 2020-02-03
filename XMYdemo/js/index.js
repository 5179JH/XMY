// layui相关
layui.use(['layer', 'laytpl', 'laypage'], function() {
	var layer = layui.layer;
	var laytpl = layui.laytpl;
	var laypage = layui.laypage;

	// 顶部大标题
	$(document).on('click', '.style_sort_li', function() {
		$(this).addClass('style_sort_click').siblings().removeClass('style_sort_click')
		let this_index = $(this).index()
		switch (this_index) {
			case 0:
				layer.msg('通用样式', {
					time: 1000
				})
				break;
			case 1:
				layer.msg('常用样式', {
					time: 1000
				})
				break;
			case 2:
				layer.msg('行业样式', {
					time: 1000
				})
				break;
			case 3:
				layer.msg('全文模板', {
					time: 1000
				})
				break;
			case 4:
				layer.msg('表情图库', {
					time: 1000
				})
				break;
			case 5:
				layer.msg('全部素材', {
					time: 1000
				})
				break;
		}
	})
	sc_show(1)

	function sc_show(curr) {
		$.get('http://xmy1018.xmyeditor.com/home/test/styles', {
			page: curr,
			limit: 20
		}, function(res) {
			// console.log(res)
			// 三元表达式 判断是否为字符串类型 解析成 JSON 数据
			res = (typeof(res) == 'string') ? $.parseJSON(res) : res,
				console.log(res.lists[0].code)
			// 清空素材容器
			$('.sc-row').html('')
			// console.log(res)
			// console.log(res.lists)
			// 插入素材
			$.each(res.lists, function(i, item) {
				// 转换数据
				item.code = get_html(item.code)
				// console.log(item.code)
				// 字符串切割
				item.tags = item.tags.split(' ')
				// console.log(item.tags)
				sc_listShow(item)
				// console.log(res.lists[0])
			})
			laypage.render({
				elem: 'sc-page',
				count: res.count,
				limit: 20,
				groups: 8,
				cuur: curr,
				layout: ['prev', 'page', 'next'],
				prev: '<i class="layui-icon layui-icon-left"></i>',
				next: '<i class="layui-icon layui-icon-right"></i>',
				jump: function(obj, first) {
					//首次不执行
					if (!first) {
						sc_show(obj.curr)
					}
				}
			})
		})
	}
	// 顶部消息滚动
	let gun = true
	$('.header_News>ul>li').mouseover(function() {
		gun = false
	})
	$('.header_News>ul>li').mouseout(function() {
		gun = true
	})
	setInterval(function() {
		let top = $('.header_News>ul').css('top');
		top = parseInt(top);
		let max = $('.header_News>ul>li').length;
		if (top - 40 <= -(max * 40)) {
			top = 0;
			$('.header_News>ul').animate({
				top: top
			}, 1);
		} else {
			if (gun) {
				$('.header_News>ul').animate({
					top: top - 40
				}, 1000);
			}
		}
	}, 3000)

	function sc_listShow(data) {
		// 获取第一列的高度
		let sc_row1 = $('.sc-row').eq(0).outerHeight();
		// console.log(sc_row1)
		// 获取第二列的高度
		let sc_row2 = $('.sc-row').eq(1).outerHeight();
		// 获取第三列的高度
		let sc_row3 = $('.sc-row').eq(2).outerHeight();
		if (sc_row1 <= sc_row2 && sc_row1 <= sc_row3) {
			laytpl($('.sc-html').html()).render(data, function(html) {
				$('.sc-row').eq(0).append(html)

			})
		} else if (sc_row2 <= sc_row1 && sc_row2 <= sc_row3) {
			laytpl($('.sc-html').html()).render(data, function(html) {
				$('.sc-row').eq(1).append(html)

			})
		} else {
			laytpl($('.sc-html').html()).render(data, function(html) {
				$('.sc-row').eq(2).append(html)

			})
		}
	}

	// 字符串转html
	function get_html(string) {
		console.log(string)
		string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		console.log(string)
		string = string.replace(/&#0*39;/g, "'")
		string = string.replace(/&quot;/g, '"')
		string = string.replace(/&amp;/g, '&');
	}



	// sc_show(1)
	// // 单素材
	// function sc_show(curr) {
	// 	index_ajax({
	// 		page: curr,
	// 		limit: 20
	// 	}, 'http://xmy1018.xmyeditor.com/home/test/styles', 'POST', true, function(result) {
	// 		result = (typeof(result) == 'string') ? $.parseJSON(result) : result;
	// 		// 清空素材容器
	// 		$('.sc-row').html('');

	// 		console.log(result)
	// 		// 插入素材
	// 		$.each(result.lists, function(i, itm) {
	// 			// 素材内容转换
	// 			itm.code = get_html(itm.code);
	// 			// 素材标签转换
	// 			itm.tags = itm.tags.split(' ')
	// 			sc_listShow(itm)
	// 		});
	// 		console.log(result.lists[0])
	// 		// 分页
	// 		laypage.render({
	// 			elem: 'sc-page',
	// 			count: result.count,
	// 			limit: 20,
	// 			groups: 10,
	// 			curr: curr,
	// 			layout: ['prev', 'page', 'next'],
	// 			prev: '<i class="layui-icon layui-icon-left"></i>',
	// 			next: '<i class="layui-icon layui-icon-right"></i>',
	// 			jump: function(obj, first) {
	// 				//首次不执行
	// 				if (!first) {
	// 					sc_show(obj.curr)
	// 				}
	// 			}
	// 		});
	// 	});
	// }
	// function sc_listShow(data) {
	// 	// 获取第一列的高
	// 	var sc_row1 = $('.sc-row').eq(0).outerHeight();
	// 	// 获取第二列的高
	// 	var sc_row2 = $('.sc-row').eq(1).outerHeight();
	// 	// 获取第三列的高
	// 	var sc_row3 = $('.sc-row').eq(2).outerHeight();
	// 	// 插入第一个
	// 	if (sc_row1 <= sc_row2 && sc_row1 <= sc_row3) {
	// 		laytpl($('.sc-html').html()).render(data, function(html) {
	// 			$('.sc-row').eq(0).append(html)
	// 		});
	// 	}
	// 	// 插入第二个
	// 	if (sc_row2 < sc_row1 && sc_row2 <= sc_row3) {
	// 		laytpl($('.sc-html').html()).render(data, function(html) {
	// 			$('.sc-row').eq(1).append(html)
	// 		});
	// 	}
	// 	// 插入第三个
	// 	if (sc_row3 < sc_row1 && sc_row3 < sc_row2) {
	// 		laytpl($('.sc-html').html()).render(data, function(html) {
	// 			$('.sc-row').eq(2).append(html)
	// 		});
	// 	}
	// }
});
