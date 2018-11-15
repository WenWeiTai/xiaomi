<?php
	function getConnect(){
		header("content-type : text/html; charset=utf-8");
		
		$db = mysqli_connect("localhost","root","","xiaomi");
		
		mysqli_select_db($db,"xm_register");
		
		mysqli_query($db,"set names utf8");
		
		return $db;
	}
?>