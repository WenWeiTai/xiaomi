	/*
	 1、文本框失去焦点正则判断
	 2、正则通过发送ajax与后台对比用户名是否存在
	 3、不存在才可注册
	 */
	//控制所有判断，都成功则可以提交submit，false代表有不成功的验证
	var flag = false; 
	//用户名正则
	var unameReg = /^[a-zA-Z]\w{3,11}$/;
	//密码正则
	var pwdReg = /^\w{6,12}$/;
	//手机正则
	var phoneReg = /^1[3|5|8]\d{9}$/;
	
	
	//用户名判断
	$('#username').blur(function(){
		var _this = this;
		var unameVal = $(this).val();
		var uameFlag = unameReg.test(unameVal);
		if(uameFlag){
			$.ajax({
				type : 'get',
				url : '../php/checkUserName.php',
				data : {'uname' : unameVal},
				success : function(res){
					if(res == 0){
						$(_this).css({'borderColor' : '#ccc'})
						$('.unameCheck').html('用户名可用').css({color : 'green'});
						//用disabled控制其他文本不可点
						$('#password').attr("disabled",false);
						$('#equalityPwd').attr("disabled",false);
						$('#phone').attr("disabled",false);


						
						return flag = true;
					}else{
						//当判断数据库用户名存在时有bug(可以点其他文本框，提交可以生效)---改用disable控制
						$('.unameCheck').html('该用户名已存在，请重新输入').css({color : 'red'});
						$(_this).css({'borderColor' : 'red'}).focus();
						//用disabled控制其他文本不可点
						$('#password').attr({disabled : "disabled"}).css({background : '#fff'});
						$('#equalityPwd').attr({disabled : "disabled"}).css({background : '#fff'});
						$('#phone').attr({disabled : "disabled"}).css({background : '#fff'});
						
						return flag = false
					}
				}
			})
		}else{
			$('.unameCheck').html('用户名输入有误，请重新输入').css({color : 'red'});
			$(this).css({'borderColor' : 'red'}).focus();
			return flag = false;
		}
	});
	
	
	//密码判断
	$('#password').blur(function(){
		var pwdVal = $(this).val();
		var pwdFlag = pwdReg.test(pwdVal);
		if(pwdFlag){
			$('.pwdCheck').html('密码可用').css({'color' : 'green'});
			$(this).css({borderColor : '#ccc'});
			return flag = true;
		}else{
			$('.pwdCheck').html('密码不合格，请重新输入').css({color : 'red'});
			$(this).focus().css({borderColor : 'red'});
			return flag = false;
		}
		
	})
	
	//密码确认
	$('#equalityPwd').blur(function(){
		var equalityPwdVal = $(this).val();
		var pwdVal = $('#password').val();
		
		if(equalityPwdVal == pwdVal && equalityPwdVal != ''){
			$('.equalityPwdCheck').html('密码一致').css({'color' : 'green'});
			$(this).css({borderColor : '#ccc'});
			return flag = true;
		}else{
			$('.equalityPwdCheck').html('两次密码不一致，请重新输入').css({color : 'red'});
			$(this).css({borderColor : 'red'});
			return flag = false;
		}
	})
	
	//手机号判断
	$('#phone').blur(function(){
		var phoneVal = $(this).val();
		var phoneFlag = phoneReg.test(phoneVal);
		if(phoneFlag){
			$('.checkPhone').html('手机号正确').css({color : 'green'});
			$(this).css({borderColor : '#ccc'});
			return flag = true;
		}else{
			$('.checkPhone').html('请输入正确的手机号码').css({color : 'red'});
			$(this).css({borderColor : 'red'}).focus();
			return flag = false;
		}
	})
	
	
	
	//submit状态判断
	$('.form_login').submit(function(){
		if(flag & $('#username').val() != '' & $('#password').val() != '' & $('#equalityPwd').val() != '' & $('#phone').val() != ''){
			return true;
		}else{
			$('.checkAll').slideDown(200);
			return false;
		}
	})