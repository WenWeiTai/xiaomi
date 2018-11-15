//加载公共头尾
$('#header').load('header.html');
$('#footer').load('footer.html');

window.onload = function(){
	var param = {
		goodsId : location.search.slice(1).split('=')[1],
		glassBox : $('.glass_box'),
		detail : $('.detail'),
	}
	new Detail(param);
}

class Detail{
	constructor(param){
		this.getGoodsId = param.goodsId;
		this.glassBox = param.glassBox;
		this.detail = param.detail;
		this.getGoodsJson = null;
		this.userName = localStorage.getItem('userName');
		this.addToCart = [{"id" : this.getGoodsId,"count" : 1}];
		this.addToCartToString = JSON.stringify(this.addToCart);
		this.newGoodsInfo = {"id" : this.getGoodsId,"count" : 1};
		this.getCommonGoods = null;
		this.getUserNameGoods = null;
		this.getComNum = Number(localStorage.getItem("GoodNum"));
		this.init();
	}
	//初始运行
	init(){
		this.goodsJson();
	}
	//商品数据
	goodsJson(){
		var _this = this;
		$.getJSON('../json/detail.json',function(res){
			console.log(res);
			//成功拿到数据
			_this.getGoodsJson = res.bannerB;
			console.log(_this.getGoodsJson);
			var str = '';
			var str1 = '';
			for(var i = 0; i < _this.getGoodsJson.length; i++){
				if(_this.getGoodsId == _this.getGoodsJson[i].id){
					//放大镜图片
					str += `
							<div id="small">
								<img src=${_this.getGoodsJson[i].img1} />
								<div id="mask"></div>
							</div>
							<div id="big">
								<img  id="bigImg" src=${_this.getGoodsJson[i].img2} />
							</div>
							`
					//详情信息
					str1 += `
						<h1><span class="name">${_this.getGoodsJson[i].title}</span></h1>
						<p class="info">${_this.getGoodsJson[i].desc}</p>
						<p class="company">小米自营</p>
						<p class="price_box"><span class="price">${_this.getGoodsJson[i].price}</span></p>
						<div class="place_box">
							<div class="place">
								<p class="address"><i class="Down_arrow">&#xe6d1;</i>北京&emsp;北京市&emsp;东城区&emsp;永定门外街道&emsp;<span>修改</span></p>
								<p class="have">有现货</p>
							</div>
						</div>
						<div class="edition_box">
							<p class="edi_title">选择版本</p>
						
							<ul class="edi_list clearfix">
								<li class="list_item" id="active">
									<a href="##">
										<span class="name" id="active">${_this.getGoodsJson[i].edition1}</span>
										<span class="price">${_this.getGoodsJson[i].edition1P}</span>
									</a>
								</li>
								<li class="list_item">
									<a href="##">
										<span class="name">${_this.getGoodsJson[i].edition2}</span>
										<span class="price">${_this.getGoodsJson[i].edition2P}</span>
									</a>
								</li>
								<li class="list_item">
									<a href="##">
										<span class="name">${_this.getGoodsJson[i].edition3}</span>
										<span class="price">${_this.getGoodsJson[i].edition3P}</span>
									</a>
								</li>
							</ul>
						</div>
						<div class="edition_box">
							<p class="edi_title">选择颜色</p>
						
							<ul class="edi_list clearfix">
								<li class="list_item" id="active">
									<a class="center"  href="##">
										<span class="name" id="active">${_this.getGoodsJson[i].color}</span>
									</a>
								</li>
								<li class="list_item">
									<a class="center" href="##">
										<span class="name">${_this.getGoodsJson[i].color1}</span>
									</a>
								</li>
							</ul>
						</div>
						<a id="goCard" href="##">加入购物车</a> 
							`
				}
			}
			//图片渲染
			_this.glassBox.html(str);
			//商品详情渲染
			_this.detail.html(str1);
			
			//拿到数据渲染后，拿到节点，实现放大镜功能
			var obj = {
				small : $('#small'),
				mask : $('#mask'),
				big : $('#big'),
				bigImg : $('#bigImg')
			}
			new Glass(obj);
			
			//添加数据到localStorage
			_this.addGoodsInfo();
		})
	}
	
	addGoodsInfo(){
		var _this = this;
		$('#goCard').click(function(){
			//判断用户名是否存在
			//不存在，表示没用户登录

			if(!_this.userName){
				console.log('没有用户');
				_this.noUser();
			}else{
				console.log('用户' + _this.userName);
				_this.hasUser();
			}
			//计算数据数量
			_this.setGoodsNum();
		})
	}
	//没有用户登录
	noUser(){
		//拿到common判断里边有没有值
		this.getCommonGoods = localStorage.getItem('common');
		//没有值添加一条新值
		if(!this.getCommonGoods){
			localStorage.setItem("common",this.addToCartToString);
		}else{
			//当有值时，对拿到的数据循环判断，当前点击添加的数据是否存在，存在时添加数量，不存在添加新数据
			this.getCommonGoodsToObj = JSON.parse(this.getCommonGoods);
			// ---------------这里需要一个控制器来控制不存在数据时的数据添加，循环内不能操作，会多次添加
			var flag = false; //表示不存在
			for(var i = 0; i < this.getCommonGoodsToObj.length; i++){
				if(this.getGoodsId == this.getCommonGoodsToObj[i].id){
					this.getCommonGoodsToObj[i].count++;
					flag = true;
				}
			}
			//不存在数据就添加当前点击的数据
			if(!flag){
				this.getCommonGoodsToObj.push(this.newGoodsInfo);
			}
			//将新数据添加到localStorage
			localStorage.setItem("common",JSON.stringify(this.getCommonGoodsToObj))
		}
	}

	//有用户登录
	hasUser(){
		//当有数据时才拿数据
		this.getUserNameGoods = localStorage.getItem(this.userName + "Goods");
		//拿到数据后，如果为null，就把当前打击的数据添加进去
		if(!this.getUserNameGoods){
			localStorage.setItem(this.userName + 'Goods' , this.addToCartToString);
		}else{
			this.getUserNameGoodsToObj = JSON.parse(this.getUserNameGoods);
			//存在情况下，判断添加的数据在localStorage里是否存在
			//存在则追加一个数量
			var flag = false;
			for(var i = 0; i < this.getUserNameGoodsToObj.length; i++){
				if(this.getGoodsId == this.getUserNameGoodsToObj[i].id){
					this.getUserNameGoodsToObj[i].count++;
					flag = true;
				}
			}
			if(!flag){
				//不存在则添加一条新数据
				this.getUserNameGoodsToObj.push(this.newGoodsInfo)
			}
			var newUserNameGoods = JSON.stringify(this.getUserNameGoodsToObj);
			localStorage.setItem(this.userName + 'Goods',newUserNameGoods);
		}


	}

	//数据数量添加
	setGoodsNum(){
		this.goodsNum = 0;
		//只有common数据
		if(!localStorage.getItem(this.userName + "Goods") && localStorage.getItem('common')){
			console.log('只有common数据');
			this.getCommonGoods = JSON.parse(localStorage.getItem('common'));
			for(var i = 0; i < this.getCommonGoods.length; i++){
				this.goodsNum += this.getCommonGoods[i].count;
			}
			localStorage.setItem("GoodNum",JSON.stringify(this.goodsNum));
			$('#shopNum').html(this.goodsNum);
		//只有用户数据
		}else if(localStorage.getItem(this.userName + "Goods") && !localStorage.getItem('common')){
			console.log('只有用户数据');
			this.getUserGoods = JSON.parse(localStorage.getItem(this.userName + "Goods"));
			for(var i = 0; i < this.getUserGoods.length; i++){
				this.goodsNum += this.getUserGoods[i].count;
			}
			localStorage.setItem("GoodNum",JSON.stringify(this.goodsNum));
			$('#shopNum').html(this.goodsNum);
		//有common数据又有用户数据
		}else if(localStorage.getItem(this.userName + "Goods") && localStorage.getItem('common')){
			console.log('有common数据又有用户数据');
			this.getCommonGoods = JSON.parse(localStorage.getItem('common'));
			this.getUserGoods = JSON.parse(localStorage.getItem(this.userName + "Goods"));
			//实现公有和用户数据合并
			for(var i = 0; i < this.getCommonGoods.length; i++){
				this.getUserGoods.push(this.getCommonGoods[i]);
			}
			for(var i = 0; i < this.getUserGoods.length; i++){
				for(var j = i + 1; j < this.getUserGoods.length; j++){
					if(this.getUserGoods[i].id == this.getUserGoods[j].id){
						this.getUserGoods[i].count += this.getUserGoods[j].count;
						this.getUserGoods.splice(j,1)
						j--
					}
				}
			}
			for(var i = 0; i < this.getUserGoods.length; i++){
				this.goodsNum += this.getUserGoods[i].count;
			}
			localStorage.setItem("GoodNum",JSON.stringify(this.goodsNum));
			$('#shopNum').html(this.goodsNum);
		}
	}
}
	

// 放大镜
class Glass {
	constructor(obj){
		this.small = obj.small;
		this.mask = obj.mask;
		this.big = obj.big;
		this.bigImg = obj.bigImg;
		this.init();
	};

	init(){
		this.mouseenter();
		this.mouseleave();
		this.mousemove();
	};

	mouseenter(){
		var _this = this;
		this.small.mouseenter(function(){
			_this.mask.stop().fadeIn(200);
			_this.big.stop().fadeIn(200);
			$(this).css({"border":"2px solid #eee"}).fadeIn(200);
		})
	};

	mouseleave(){
		var _this = this;
		this.small.mouseleave(function(){
			_this.mask.stop().fadeOut(200);
			_this.big.stop().fadeOut(200);
			$(this).stop().css({"border":"2px solid #fff"});
		})
	};

	mousemove(){
		var _this = this;
		this.small.mousemove(function(e){
			var l = e.pageX - _this.mask.width() / 2 - $(this).offset().left;
			var t = e.pageY - _this.mask.height() / 2 - $(this).offset().top;
			
			var maxL = $(this).width() - _this.mask.width();
			var maxT = $(this).height() - _this.mask.height();

			l = l < 0 ? 0 : (l > maxL ? maxL : l);
			t = t < 0 ? 0 : (t > maxT ? maxT : t);

			var L = -_this.bigImg.width() / $(this).width() * l;
			var T = -_this.bigImg.height() / $(this).height() * t;

			_this.mask.css({
				left : l,
				top : t
			});

			_this.bigImg.css({
				left : L,
				top : T
			})

		})
	}
}
