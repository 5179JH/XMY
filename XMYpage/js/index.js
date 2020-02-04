// layui.use(['layer'], function() {
// 	var layer = layui.layer;
// 	var mySwiper01


// 	// 初始化轮播图
// 	var mySwiper01 = new Swiper('.page-banner-swiper', {
// 		// 切换时间
// 		autoplay: true,
// 		effect: 'cube',
// 		fadeEffect: {
// 			crossFade: true,
// 		},
// 		watchOverflow: true, //只有一个时失效
// 		direction: 'horizontal', //切换方向
// 		loop: true, //循环轮播
// 		initialSlide: 0, //初始化展示
// 		grabCursor: false, //鼠标移动变成手型
// 		roundLengths: true, //参数取整
// 		autoHeight: true,
// 		// 前进后退按钮
// 		navigation: {
// 			nextEl: '.swiper-button-next',
// 			prevEl: '.swiper-button-prev'
// 		}
// 	})

// 	// 点击小图展示对应的轮播图
// 	$(document).on('click', '.page-banner-li', function() {
// 		// 获取id
// 		var this_id = $(this).attr("data-id");
// 		// 切换到第几个轮播
// 		mySwiper01.slideTo(this_id, 300, false); //切换到第一个slide，速度为1秒
// 	});

// 	})

// 初始化 Swiper 
const mySwiper = new Swiper('.swiper-container', {
	loop: true, // 循环模式选项
	autoplay: true, // 自动切换
	// effect: 'fade', // 淡入
	effect: 'cube', // 方块
	// effect: 'coverflow', // 3d流
	// effect: 'flip', // 3d翻转
	// 前进后退按钮
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
})

// 点击小图展示对应的轮播图
// 获取被点击的小图
$(document).on('click', '.page-banner-li', function(){
	// 获取 id
	let this_id = $(this).attr('data-id')
	// 切换到第几个轮播
	mySwiper.slideTo(this_id, 300, false); //切换到第一个slide，速度为1秒
})