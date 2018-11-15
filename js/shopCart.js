$('#footer').load('footer.html');

$(function () {
    new ShowCart();
});

class ShowCart {
    constructor() {
        this.shopCart = 0;
        this.user = null;
        this.price = 0;
        this.total = 0;
        this.num = 0;
        this.sid = 0;
        this.getGoodNum = localStorage.getItem('GoodNum');
        console.log(this.getGoodNum)
        this.init()
    }
    init() {
        this.getLocalGoods();
        this.getGoodsInfo();
        this.checkUser();
    }
    //判断用户还是公共数据
    getLocalGoods() {
        this.user = localStorage.getItem('userName');

        //公共数据
        if (!this.user) {
            console.log('没有用户登录');
            //有数据，跳到购物车才会渲染，这里不需要考虑common是不是没有，需要渲染就一定有数据
            this.getLocalStorageGoods = localStorage.getItem('common');
            //当时公共数据时，赋值当前的公共名,为后面的增加减少数量以及删除操作更新localStorage做准备
            this.user = "common";
            this.getLocalStorageGoodsObj = JSON.parse(this.getLocalStorageGoods);
            this.shopCart = this.getLocalStorageGoodsObj;
        } else {
            //已登录用户数据
            console.log(this.user + '登录');
            $('.loginUser').html(this.user);
            //进到购物车有数据才抓取
            //有用户数据
            this.user = this.user + 'Goods'; //wenweitaiGoods
            if(localStorage.getItem(this.user) && localStorage.getItem(this.user) != 'null'){ 
                this.getloginUserageGoods = localStorage.getItem(this.user);
                this.getloginUserageGoodsObj = JSON.parse(this.getloginUserageGoods);
                //没公共，有用户，直接渲染
                this.shopCart = this.getloginUserageGoodsObj;
            }
            //有公共数据
            if(localStorage.getItem('common')){
                this.getLocalStorageGoods = localStorage.getItem('common');
                this.getLocalStorageGoodsObj = JSON.parse(this.getLocalStorageGoods);
                //将公共数据合并到用户数据里
                //有公共，没用户，需把公共合并到用户
                if(!localStorage.getItem(this.user)){
                    this.getloginUserageGoodsObj = localStorage.getItem('common');
                    localStorage.setItem(this.user,this.getloginUserageGoodsObj);
                    var com = '';
                    localStorage.setItem('common',com);
                    // //重新计算数量
                    // this.getGoodNum = 0;
                    // for(var i = 0; i < this.getloginUserageGoodsObj.length; i++){
                    //     this.getGoodNum += this.getloginUserageGoodsObj[i].count;
                    // }
                    // localStorage.setItem("GoodNum", String(this.getGoodNum));
                    this.shopCart = JSON.parse(localStorage.getItem(this.user));
                }else{
                    //有公共，有用户，需把公共合并到用户
                    this.getCommonGoods = localStorage.getItem('common');
                    this.getloginUserageGoods = localStorage.getItem(this.user);
                    console.log('common'+ this.getCommonGoods , '用户' +  this.getloginUserageGoods);
                    this.getCommonGoodsObj = JSON.parse(this.getCommonGoods);
                    this.getloginUserageGoodsObj = JSON.parse(this.getloginUserageGoods);
                    //实现公有和用户数据合并
                    for(var i = 0; i < this.getCommonGoodsObj.length; i++){
                        this.getloginUserageGoodsObj.push(this.getCommonGoodsObj[i]);
                    }
                    for(var i = 0; i < this.getloginUserageGoodsObj.length; i++){
                        for(var j = i + 1; j < this.getloginUserageGoodsObj.length; j++){
                            if(this.getloginUserageGoodsObj[i].id == this.getloginUserageGoodsObj[j].id){
                                this.getloginUserageGoodsObj[i].count += this.getloginUserageGoodsObj[j].count;
                                this.getloginUserageGoodsObj.splice(j,1)
                                j--
                            }
                        }
                    }
                    //合并完清空公有数据
                    var com = '';
                    localStorage.setItem('common',com);
                    //重新计算数量
                    this.getGoodNum = 0;
                    for(var i = 0; i < this.getloginUserageGoodsObj.length; i++){
                        this.getGoodNum += this.getloginUserageGoodsObj[i].count;
                    }

                    localStorage.setItem("GoodNum", String(this.getGoodNum));
                    console.log('去重累加相同值',this.getloginUserageGoodsObj);
                    this.getloginUserageGoods = JSON.stringify(this.getloginUserageGoodsObj)
                    localStorage.setItem(this.user,this.getloginUserageGoods);
                    this.shopCart = JSON.parse(localStorage.getItem(this.user));
                }
            }
        }
    }
    //请求数据
    getGoodsInfo() {
        var _this = this;
        $.getJSON('../json/detail.json', function (res) {
            var data = res.bannerB;
            var str = '';
            var countMoney = 0;
            var countGoodsNum = 0;
            if (_this.shopCart) {
                for (var i = 0; i < _this.shopCart.length; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (_this.shopCart[i].id == data[j].id) {
                            str += `
                                <div class="item-row" sid="${data[j].id}">
                                    <div class="fl col col-check">
                                        <label><input type="checkbox" class="checkbox1 check"></label>
                                    </div>
                                    <div class="fl col col-img">
                                        <a href="##"><img src=${data[j].img1}></a>
                                    </div>
                                    <div class="fl col col-name"><h3 class="name">${data[j].title + data[j].desc}</h3></div>
                                    <div class="fl col col-price"><span class="price">${data[j].price}</span></div>
                                    <div class="fl col col-num">
                                        <div class="change-num clearfix">
                                            <a class="reduceNum" href="##"><i class="Down_arrow">-</i></a>
                                            <input class="shopCartNum" type="text" value="${_this.shopCart[i].count}" disabled = "disabled">
                                            <a class="addNum" href="##"><i class="Down_arrow">+</i></a>
                                        </div>
                                    </div>
                                    <div class="fl col col-total"><span class="total">${parseInt(_this.shopCart[i].count) * parseInt(data[j].price)}</span>元</div>
                                    <div class="fl col col-action"><a class="item-del" href="##"><i class="Down_arrow">&#xe606;</i></a></div>
                                </div>
                                `
                            countMoney += parseInt(_this.shopCart[i].count) * parseInt(data[j].price)
                            countGoodsNum++
                        }
                    }
                }
            }
            //渲染数据
            $('.item-table').html(str);
            //初始总价
            $('.priceCount > i').html(countMoney);
            //初始商品数量
            $('.countGoodsNum').html(countGoodsNum);
            //全选
            _this.checkBox();
            //加、减、删除
            _this.changeCount();
        })
    }
    //加减、删除
    changeCount() {
        var _this = this;
        //加
        $('.item-table').on('click', '.addNum', function () {
            //当前数量
            _this.num = Number($('.shopCartNum').eq($(this).index('.addNum')).val());
            //加
            _this.num++;
            $('.shopCartNum').eq($(this).index('.addNum')).val(_this.num + '');
            //商品id
            _this.sid = $('.item-row').eq($(this).index('.addNum')).attr("sid");
            _this.price = $('.price').eq($(this).index('.addNum')).html();
            _this.total = $('.total').eq($(this).index('.addNum'));
            //更新localStorage
            _this.addCount(_this.sid);
            //小计
            _this.addMoney()
            //合计
            _this.priceCount();
        })
        //减
        $('.item-table').on('click', '.reduceNum', function () {
            _this.num = Number($('.shopCartNum').eq($(this).index('.reduceNum')).val());
            if (_this.num == 1) {
                _this.num = 1;
            } else {
                _this.num--;
            }
            $('.shopCartNum').eq($(this).index('.reduceNum')).val(_this.num + '');
            _this.sid = $('.item-row').eq($(this).index('.reduceNum')).attr("sid");
            _this.price = $('.price').eq($(this).index('.reduceNum')).html();
            _this.total = $('.total').eq($(this).index('.reduceNum'));
            _this.reduceCount(_this.sid);
            _this.addMoney();
            _this.priceCount();
        })
        //删
        $('.item-table').on('click', '.item-del', function () {
            _this.sid = $('.item-row').eq($(this).index('.item-del')).attr("sid");
            _this.delGoods(_this.sid)
            // console.log(_this.sid);
        })
    }
    //添加数量更新localStorage
    addCount(sid) {
        var getLS = localStorage.getItem(this.user);
        var getJSObj = JSON.parse(getLS);
        for (var i = 0; i < getJSObj.length; i++) {
            if (getJSObj[i].id == sid) {
                getJSObj[i].count++;
                this.getGoodNum++
                console.log(this.getGoodNum);//NaN
            }
        }
        localStorage.setItem(this.user, JSON.stringify(getJSObj));
        localStorage.setItem("GoodNum", this.getGoodNum);
    }
    //减少数量更新localStorage
    reduceCount(sid) {
        var getLS = localStorage.getItem(this.user);
        var getJSObj = JSON.parse(getLS);
        for (var i = 0; i < getJSObj.length; i++) {
            if (getJSObj[i].id == sid) {
                if (getJSObj[i].count == 1) {
                    getJSObj[i].count = 1;
                } else {
                    getJSObj[i].count--;
                    this.getGoodNum--;
                }

            }
        }
        localStorage.setItem(this.user, JSON.stringify(getJSObj));
        localStorage.setItem("GoodNum", this.getGoodNum);
    }
    //删除更新localStorage
    delGoods(sid) {
        this.getUserGoods = localStorage.getItem(this.user); //aaaaGoods
        this.getUserGoodsObj = JSON.parse(this.getUserGoods);
        this.goodsNum = Number(localStorage.getItem('GoodNum'));

        for (var i = 0; i < this.getUserGoodsObj.length; i++) {
            if (this.getUserGoodsObj[i].id == sid) {
                //找到相等的数据，通过对应下标删除数据
                this.goodsNum -= this.getUserGoodsObj[i].count;
               
                this.getUserGoodsObj.splice(i, 1);
            }
        }
        localStorage.setItem(this.user, JSON.stringify(this.getUserGoodsObj));
        localStorage.setItem("GoodNum", this.goodsNum);
        location.reload();  
    }
    //小计
    addMoney() {
        //单价*数量
        this.total.html(this.num * parseInt(this.price));
    }
    //合计
    priceCount() {
        var countPrice = 0;
        $('.total').each(function (index, item) {
            countPrice += Number($(item).html())
        })
        $('.priceCount > i').html(countPrice);
    }
    //全选
    checkBox() {
        $('.checkAll').click(function () {
            $('.check').prop('checked', $(this).prop('checked'));
            //全选数量判断
            if ($(this).prop('checked')) {
                $('.checkCount').html($('.item-row').size())
            } else {
                $('.checkCount').html(0)
            }
        });

        $('.check').click(function () {
            var flag = true;
            $('.check').each(function (index, item) {
                if (!$(item).prop('checked')) {
                    flag = false;
                    return;
                }
            })
            if (flag) {
                $('.checkAll').prop('checked', true);
            } else {
                $('.checkAll').prop('checked', false);
            }

            //单选数量判断
            var count = 0;
            for (var i = 0; i < $('.check').size(); i++) {
                if ($('.check').eq(i).prop('checked')) {
                    count++
                }
            }
            $('.checkCount').html(count)
        })
    }
    //检测登录名
    checkUser() {
        $('.settleAccounts').click(function () {
            var user = localStorage.getItem('userName');
            if (!user) {
                alert('请先登录');
                location.href = "../html/login.html";
            }
        })
    }
};