<?php
	include('public.php');
	$id = $_GET['id'];
	
	$db = getConnect();
	
	$sql = "select name from xm_register where id = $id";
	
	$result = mysqli_query($db,$sql);
	
	$row = mysqli_fetch_array($result);
	
	echo $row['name'];
	
?>