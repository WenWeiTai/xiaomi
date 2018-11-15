//当成功登录后，后台携带用户名到主页url上，主页一加载，就拿到用户名，设置在localStorage里，键名用username，每次登录不同的用户名，都会替换username的值，用这个值来实现用户已登录操作
//先设置localStorage,再加载公共头部,根据加载顺序，可以拿到公共头部的节点进行操作
var setUserName = location.search.slice(1);
if(setUserName){
	localStorage.setItem("userName",setUserName);
}



/* 头部 尾部 公共*/
$('#header').load('header.html');
$('#footer').load('footer.html');


/*---------------------------------轮播图跟主页数据渲染,功能实现---------------------------------------------------------*/

/* 小米闪购，轮播下3图 */
// 请求数据
$.getJSON('../json/data.json',function(res){
	
	//轮播图数据
	var banner = res.banner;
	//轮播下3图数据
	var bannerB = res.bannerB;
	//小米闪购数据
	var xmsg = res.xmsg;
	//小米闪购下广告图数据
	var xmsg_b = res.xmsg_b;
	//手机模块
	var obj_l = res.sj_l;
	var obj = res.sj;
	var obj_b = res.sj_b

	var bannerStr = '';
	var xmsgStr = '';
	var bannerBStr = '';
	
	//轮播图
		bannerStr += `
		<li style="z-index: 5;"><a href="##"><img src=${banner[0].img}></a></li>
		<li style="z-index: 4;"><a href="##"><img src=${banner[0].img1}></a></li>
		<li style="z-index: 3;"><a href="##"><img src=${banner[0].img2}></a></li>
		<li style="z-index: 2;"><a href="##"><img src=${banner[0].img3}></a></li>
		<li style="z-index: 1;"><a href="##"><img src=${banner[0].img4}></a></li>
		`

	//轮播图下3图
	for(var i = 0; i < bannerB.length; i++){
		bannerBStr += `
			<li><a href="detail.html?id=${bannerB[i].id}"><img src=${bannerB[i].img}></a></li>
			`
	}

	//小米闪购
	for(var i = 0; i < xmsg.length; i++){
		xmsgStr += `
			<li class="bgC countDown borderT${i}">
				<a href="detail.html?id=${xmsg[i].id}">
					<div class="bg"></div>
				</a>
				<div class="content">
					<a class="imgSrc"><img src=${xmsg[i].img}></a>
				</div>
				<h3 class="title">
					<a>${xmsg[i].title}</a>
				</h3>
				<p class="desc">${xmsg[i].desc}</p>
				<p class="price">
					<span>${xmsg[i].price}</span>&nbsp;<span>元</span>&nbsp; <del>${xmsg[i].del}</del>
				</p>
				<div class="flog">${xmsg[i].flag}</div>
			</li>
			`
	}
	
	//小米闪购下广告图
	var xmsg_bStr = `
		<a sid="${xmsg_b[0].id}" href="##"><img class="main" src=${xmsg_b[0].img}></a>
		`
	// 手机左
	var str_l = `
				<li class="c_l_li" sid="${obj_l[0].id}">
					<a href="##"><img src=${obj_l[0].img}></a>
				</li>
				`;
	// 手机右
	var str_r = '';
	// 手机下的广告图
	var str_b = `
				<a href="##" sid="${obj_b[0].id}"><img src=${obj_b[0].img}></a>
				`
	// 手机右
	for(var i = 0; i < obj.length; i++){
		str_r += `
				<li id="itemBox" gid="${obj[i].id}">
					<div class="img_box">
						<a class="img_lk" href="detail.html"><img class="item_img" src=${obj[i].img}></a>
					</div>
					<h3 class="item_title">
						<a class="title_txt" href="detail.html">${obj[i].title}</a>
					</h3>
					<p class="title_info">${obj[i].desc}</p>
					<p class="price">
						<span>${obj[i].price}</span>元
						<del><span>${obj[i].del}</span>元</del>
					</p>
					<div class="${obj[i].class} flag">${obj[i].flag}</div>
				</li>
		
				`
	}
	
	
	// 数据渲染
	$('.ban_img').html(bannerStr);

	$('#r_pic').html(bannerBStr);
	
	$('.reducedBox').html(xmsgStr);
	
	$('.banPic').html(xmsg_bStr);

	//手机模版数据渲染
	$('.c_l').html(str_l);

	$('.c_r').html(str_r);

	$('#advertising_box').html(str_b);
	
	//解决轮播图下3张图布局问题
	$('#r_pic > li:first').addClass("firstLi");

	//轮播图实现
	class AutoPlayBanner{
		constructor(obj){
			this.banBox = obj.banBox;
			this.banImg = obj.banImg;
			this.banNav = obj.banNav;
			this.banArr_l = obj.banArr_l;
			this.banArr_r = obj.banArr_r;
			this.index = 0;
			this.timer = null;
			this.init();
		}
		// 初始
		init(){
			this.autoPlay();
			this.clickArr();
			this.mouseOver();
			this.mouseOut();
		}
		// 自动播放
		autoPlay(){
			clearInterval(this.timer);
			var _this = this;
			this.timer = setInterval(function(){
				_this.index++;
				if(_this.index > _this.banImg.size() - 1){
					_this.index = 0;
				}
				_this.banImg.eq(_this.index).fadeIn(1000).siblings().fadeOut(1000);
				_this.playNav();
			},2000)
		}
		// 导航小点
		playNav(){
			this.banNav.eq(this.index).addClass('numActive').siblings().removeClass();
		}
		// 左右箭头
		clickArr(){
			var _this = this;
			this.banArr_l.click(function(){
				_this.index--
				if(_this.index < 0){
					_this.index = 0;
					$(this).addClass('arr_l1');
				}
				_this.banImg.eq(_this.index).fadeIn().siblings().fadeOut();
				_this.playNav();
			})


			this.banArr_r.click(function(){
				_this.index++;
				if(_this.index > _this.banImg.size() - 1){
					_this.index = _this.banImg.size() - 1;
					$(this).addClass('arr_r1');
				}
				_this.banImg.eq(_this.index).fadeIn().siblings().fadeOut();
				_this.playNav();
			})
		}
		// 鼠标进入轮播图
		mouseOver(){
			this.banBox.mouseover(function(){
				clearInterval(this.timer);
			}.bind(this))
		}
		// 鼠标离开轮播图
		mouseOut(){
			this.banBox.mouseout(function(){
				this.autoPlay();
				this.banArr_l.removeClass('arr_l1');
				this.banArr_r.removeClass('arr_r1');
			}.bind(this));
		}
	}

	var obj = {
		banBox : $('#banPlay'),
		banImg : $('#banPlay > .ban_img > li'),
		banNav : $('#banPlay > .ban_num > li'),
		banArr_l : $('.arrBox > .arr_l'),
		banArr_r : $('.arrBox > .arr_r'),
	};
	new AutoPlayBanner(obj);

	//动画效果
	//手机模块
	//左边
	itemMove('.c_l','.c_l_li');
	//右边
	itemMove('.c_r','#itemBox');

	//小米闪购的轮播切换//点击一次移动992 总长度：3968px
	var count = 0
	$('.more > .arr_r').click(function(){
		count++

		if(Math.abs($('.reducedBox').position().left) + 992*2 > $('.reducedBox').width()){
			$('.reducedBox').stop().position({left : -$('.reducedBox').width()});
			count = 3;
			$(this).css({background : '#ccc'}).fadeIn();
		}else{
			$('.reducedBox').stop().animate({left : -992 * count},500);
			$('.more > .arr_l').css({background : '#fff'}).fadeIn();
			console.log(Math.abs($('.reducedBox').position().left) + 992*2 );
		}
	})
	$('.more > .arr_l').click(function(){
		if(count < 1){
			count = 0;
			$(this).css({background : '#ccc'}).fadeIn();
		}else{
			count--
			$('.more > .arr_r').css({background : '#fff'}).fadeIn();
		}
		$('.reducedBox').stop().animate({left : -992 * count},500);
	})
});


/* 版块数据 */

$.getJSON('../json/goods.json',function(res){	
	//	整个类循环
	var str1 = '';
	for(var j = 0; j < res.length; j++){//3
		// 商品列表循环，每次清空之前的str
		var str = '';
		//循环模块里的具体商品	
		for(var i = 0; i < res[j].list.length; i++){//8
			str += `
					<li id="itemBox" sid=${res[j].list[i].id}>
						<div class="img_box">
							<a class="img_lk" href="detail.html"><img class="item_img" src=${res[j].list[i].img}></a>
						</div>
						<h3 class="item_title">
							<a class="title_txt" href="detail.html">${res[j].list[i].title}</a>
						</h3>
						<p class="title_info">${res[j].list[i].desc}</p>
						<p class="price">
							<span>${res[j].list[i].price}</span>元
							<del><span>${res[j].list[i].del}</span>元</del>
						</p>
						<div class="${res[j].list[i].class} flag">${res[j].list[i].flag}</div>
					</li>
				`
		}
		//循环整个模块
		str1 += `
				<div id="listTitle">
					<h2 class="title">${res[j].title}</h2>
					<div class="more">
						<ul class="more_nav">
							<li class="nav_active">${res[j].li1}</li>
							<li>${res[j].li2}</li>
							<li>${res[j].li3}</li>
							<li>${res[j].li4}</li>
						</ul>
					</div>
				</div>
				<div id="listContentBox">
					<div id="listContent" class="clearfix">
						<div id="content_l">
							<ul class="c_l1">
								<li class="c_l_box c_l_box1">
									<a href="##"><img src=${res[j].src1} ></a>
								</li>
								<li class="c_l_box c_l_box2">
									<a href="##"><img src=${res[j].src2} ></a>
								</li>
							</ul>
						</div>
						<!-- 右边 -->
						<div id="content_r">
							<ul class="c_r1">
								${str}
							</ul>
						</div>
					</div>
				</div>
				<div id="advertising_box1">
					<a href="##"><img src=${res[j].src3}></a>
				</div>
				`
	}
	$('#listItem1').html(str1)

	//家电以下模块
	itemMove('.c_l1','.c_l_box1');
	itemMove('.c_l1','.c_l_box2');
	itemMove('.c_r1','#itemBox');
})

//事件委托动画
function itemMove(parentEle,childEle){
	$(parentEle).on('mouseenter',childEle,function(){
		$(this).eq($(this).index(childEle)).stop().animate({'top' : -5},300);
	});
	$(parentEle).on('mouseleave',childEle,function(){
		$(this).eq($(this).index(childEle)).stop().animate({'top' : 0},300);
	})
}