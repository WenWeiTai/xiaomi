	$('.form_login').submit(function(){
		if($('#username').val() != '' && $('#password').val() != ''){
			return true;
		}else if($('#username').val() == ''){
			$('.checkAll').slideDown(200).html('*请输入用户名').css({color : 'red'});
			return false;
		}else if($('#password').val() == ''){
			$('.checkAll').slideDown(200).html('*请输入密码').css({color : 'red'});
			return false;
		}
	})
	
	$('#username').focus(function(){
		$('.checkAll').slideUp(200);
	})
	
	$('#password').focus(function(){
		$('.checkAll').slideUp(200);
	})