<?php
	$SiteName = $_POST['SiteName'];
	$User=$_POST['User'];
	$Action=$_POST['Action'];
	$White = array("google.com", "twitter.com", "chrome-extension", "facebook.com", "youtube.com", "yahoo.com", "reddit.com", "amazon.com", "instagram.com",
	 	       "linkedin.com", "netflix.com");

    	$database = "vestzqdi_phishNet_commBlacklist";
	$username = "vestzqdi_phishnet";
	$password = "(v4v*{~H1V}s1Lr6ky";
	
	// Create connection
	$conn= mysql_connect('localhost', $username, $password, $database);
	mysql_select_db($database, $conn) or die( "Unable to select database");
	// Check connection
	if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error);
	} 
	///////////////////////////////////////
	//Editors Sites
	$addc = "ALTER TABLE `Sites` ADD `$SiteName` TEXT NOT NULL"; //add site (column)
	$addrow ="INSERT INTO `Sites`(`$SiteName`) VALUES ('$User')"; //add user in new row
	$addu = "UPDATE `Sites` SET `$SiteName`='$User' WHERE `$SiteName`='' LIMIT 1"; //add user to site
	//Editors Users
	$Uaddc = "ALTER TABLE `Users` ADD `$User` TEXT NOT NULL"; //add site (column)
	$Uaddrow ="INSERT INTO `Users`(`$User`) VALUES ('$SiteName')"; //add user in new row
	$Uaddu = "UPDATE `Users` SET `$User`='$SiteName' WHERE `$User`='' LIMIT 1"; //add site to user
	
	$remu = "UPDATE `Sites` SET `$SiteName`='' WHERE `$SiteName`='$User'"; //delete user
	$rems = "ALTER TABLE `Sites` DROP COLUMN `$SiteName`"; //delete site (column)
	
	$Uremu = "UPDATE `Users` SET `$User`='' WHERE `$User`='$SiteName'"; //delete site
	$Urems = "ALTER TABLE `Users` DROP COLUMN `$User`"; //delete user (column)

	
	$Count = "SELECT `$SiteName` FROM `Sites` WHERE NOT `$SiteName` = ''";//executes count
	$Num= mysql_query($Count);//returns resource of count
	if($Num!=True){
		$CNum=0;
	}else{
  		$CNum= mysql_num_rows($Num); //get value of count
  	}
	
	//Parameters
	$SearchUser= "SELECT `$SiteName` FROM `Sites` WHERE `$SiteName` = '$User'";//checks if user exists in given site column
	$SearchRow = "SELECT `$SiteName` FROM `Sites` WHERE `$SiteName` = ''"; //searches for closest empty cell
  	$SearchSite = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME LIKE '$SiteName' LIMIT 1"; //Checks if site(column) exists
  	$SearchEmptySite= "SELECT `$SiteName` FROM `Sites` WHERE NOT `$SiteName` = ''";// checks if there is a row which is not null
  	
  	$USearchSite= "SELECT `$User` FROM `Users` WHERE `$User` = '$SiteName'";//checks if site exists in given user column
	$USearchRow = "SELECT `$User` FROM `Users` WHERE `$User` = ''"; //searches for closest empty cell
  	$USearchUser = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME LIKE '$User' LIMIT 1"; //Checks if site(column) exists
  	$USearchEmptyUser= "SELECT `$User` FROM `Users` WHERE NOT `$User` = ''";// checks if there is a row which is not null
  				
  	
	//actions		
  	if($Action=="report"){
  		if(mysql_num_rows(mysql_query($SearchSite)) < 1){
		mysql_query($addc);//works
		}
		if(mysql_num_rows(mysql_query($USearchUser)) < 1){
		mysql_query($Uaddc);//works
		}
		if(mysql_num_rows(mysql_query($SearchUser)) < 1){
		mysql_query($addu);//works
			if(mysql_num_rows(mysql_query($SearchRow)) <1){
			mysql_query($addrow);
			}
		}
		if(mysql_num_rows(mysql_query($USearchSite)) < 1){
		mysql_query($Uaddu);
			if(mysql_num_rows(mysql_query($USearchRow)) <1){
			mysql_query($Uaddrow);
			}
		}
		echo "72";//report success code	
	}else if($Action=="unreport"){
		mysql_query($remu);//works
		mysql_query($Uremu);
		if(mysql_num_rows(mysql_query($SearchEmptySite)) < 1){
		mysql_query($rems);//works (except for unreporting unknown sites)
		}
		if(mysql_num_rows(mysql_query($USearchEmptyUser)) < 1){
		mysql_query($Urems);//works (except for unreporting unknown sites)
		}
		echo "42";//unreport success code
	}else if($Action=="getnumber"){
	if(mysql_query($SearchSite)!=true){
		$CNum=0;//site DNE
		}
		if(in_array($SiteName, $White)){
		$CNum=-1;//whitelist override
		}
		echo $CNum;//works
	}else{}
  	///////////////////////////////////////
  	
	mysql_close();	
    exit;
?>