<?php
	include("public.php");
	
	$uname = $_POST["username"];
	$password = $_POST["password"];
	$phone = $_POST["phone"];
	
	$db = getConnect();
	
	$sql = "insert into xm_register (name,pwd,phone) values ('$uname','$password','$phone')";
	
	$row = mysqli_query($db,$sql);
	
	if($row){
		echo "<script>alert('注册成功，即将跳转到登录页');location.href='../html/login.html'</script>";
	}else{
		echo "<script>alert('注册失败，请返回重新注册');location.href='../html/register.html'</script>";
	}
?>