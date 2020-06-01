<?php
    $inData = getRequestInfo();
    
    $id = $inData["ContactID"];

	// Verify these credentials
	$conn = new mysqli("localhost", "groupnum_groupnine", "L33tNyne!", "groupnum_COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "DELETE FROM `Contacts` WHERE `ID` = '".$id."'";

        if ( $result = $conn->query($sql) != TRUE )
        {
            returnWithError( $conn->error );
        }

        $conn->close(); 
        returnWithError("");  
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
        header('Content-Type: application/json');
        echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
    }
?>