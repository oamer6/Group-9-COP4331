<?php
	$inData = getRequestInfo();
	
	$id = $inData["ContactID"];
	$firstName = $inData["Firstname"];
	$lastName = $inData["Lastname"];
	$phoneNum = $inData["Phonenumber"];
	$email = $inData["email"];
	

	$conn = new mysqli("localhost", "groupnum_groupnine", "L33tNyne!", "groupnum_COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$sql = "UPDATE `Contacts` SET `FirstName`='" . $firstName . "',`LastName`='" . $lastName . "',`PhoneNum`='" . $phoneNum . "',`Email`='" . $email . "' WHERE `ID` = '" . $id . "'";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>