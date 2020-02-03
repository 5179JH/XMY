
// layui相关
layui.use(['layer','form','laydate','colorpicker','laytpl','laypage','flow'], function(){
	var layer = layui.layer;
  	var laytpl = layui.laytpl;
  	var laypage = layui.laypage;


  	// 单素材
  	sc_show(1);
  	function sc_show(curr){
		index_ajax({page:curr,limit:5},'http://xmy1018.xmyeditor.com/home/test/tpl','POST',true,function(result){
	    	result = (typeof(result) == 'string') ? $.parseJSON(result) : result;
	    	// 清空素材容器
	    	$('.sc-row').html('');
	    	// 插入素材
	    	$.each(result.lists,function(i,itm){
	    		// 素材内容转换
	    		itm.code = get_html(itm.code);
	    		// 素材标签转换
	    		itm.tags = itm.tags.split(' ')
	    		sc_listShow(itm)
	    	});
	    	console.log(result.lists[0])
			// 分页
			laypage.render({
				elem: 'sc-page',
				count:result.count,
				limit:20,
				groups:10,
				curr: curr,
				layout: ['prev','page','next'],
				prev:'<i class="layui-icon layui-icon-left"></i>',
				next:'<i class="layui-icon layui-icon-right"></i>',
				jump: function(obj,first){
					//首次不执行
					if(!first){
						sc_show(obj.curr)
					}
				}
			});
	    });
	}
    function sc_listShow(data){
    	// 获取第一列的高
    	var sc_row1 = $('.sc-row').eq(0).children().length;
    	// 获取第二列的高
    	var sc_row2 = $('.sc-row').eq(1).children().length;
    	// 获取第三列的高
    	var sc_row3 = $('.sc-row').eq(2).children().length;
    	// 获取第四列高
    	var sc_row4 = $('.sc-row').eq(3).children().length;
    	// 插入第一个
    	if( sc_row1 <= sc_row2 && sc_row1 <= sc_row3 && sc_row1 <= sc_row4 ){
    		laytpl($('.sc-html').html()).render(data, function(html){
			  	$('.sc-row').eq(0).append(html)
			});
    	}
    	// 插入第二个
    	if( sc_row2 < sc_row1 && sc_row2 <= sc_row3  && sc_row2 <= sc_row4 ){
    		laytpl($('.sc-html').html()).render(data, function(html){
			  	$('.sc-row').eq(1).append(html)
			});
    	}
    	// 插入第三个
    	if( sc_row3 < sc_row1 && sc_row3 < sc_row2 && sc_row3 <= sc_row4 ){
    		laytpl($('.sc-html').html()).render(data, function(html){
			  	$('.sc-row').eq(2).append(html)
			});
    	}
    	// 插入第四个
    	if( sc_row4 < sc_row1 && sc_row4 < sc_row2 && sc_row4 < sc_row3 ){
    		laytpl($('.sc-html').html()).render(data, function(html){
			  	$('.sc-row').eq(3).append(html)
			});
    	}
    }


});