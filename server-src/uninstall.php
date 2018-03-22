<?php
$User= $_GET['user'];

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
//////////////////////////////////////////
$Sites= "SELECT `$User` FROM `Users` WHERE `$User`!=''";
$SiteZ=mysql_query($Sites);
$SiteArray = array();
while($row = mysql_fetch_assoc($SiteZ)){
   $SiteArray[]= $row[$User];
}
$SiteList = implode("` ='', `", $SiteArray);
$SiteListCon = implode("` = '$User' OR `",$SiteArray);
// UPDATE `Sites` SET `lisef='User
$rems = "UPDATE `Sites` SET `$SiteList` ='' WHERE `$SiteListCon` = '$User'";
$remu = "ALTER TABLE `Users` DROP COLUMN `$User`";
mysql_query($remu);
mysql_query($rems);
?>
<h1>
Thanks for using PhishNet.<br>We hope to see you again!
</h1>