<?php

	include("public.php");
	
	$uname = $_GET['uname'];
	
	$db = getConnect();
	
	$sql = "select name from xm_register where name = '$uname'";
	
	$result = mysqli_query($db,$sql);
	
	$row = mysqli_fetch_array($result);
	
	if($row){
		echo 1;
	}else{
		echo 0;
		
	}
?>