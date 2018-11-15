<?php
	include('public.php');
	$uname = $_POST["uname"];
	$pwd = $_POST["pwd"];
	
	$db = getConnect();
	
	$sql = "select * from xm_register where name = '$uname'";
	
	$result = mysqli_query($db,$sql);
	
	$row = mysqli_fetch_array($result);
	
	if($row){
		if($pwd == $row['pwd']){
			echo "<script>alert('登陆成功，即将跳转到主页');location.href='../html/xiaomi.html?$row[name]'</script>";
		}else{
			echo "<script>alert('密码错误，请重新登录');location.href='../html/login.html'</script>";
		}
	}else{
		echo "<script>alert('没有此用户，请重新登录');location.href='../html/login.html'</script>";
	}
?>