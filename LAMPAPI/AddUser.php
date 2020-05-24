<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["Firstname"];
    $lastName = $inData["Lastname"];
    $username = $inData["Username"];
    $password = $inData["Password"];

	// Verify these credentials
	$conn = new mysqli("localhost", "groupnum_groupnine", "L33tNyne!", "groupnum_COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $sql = "SELECT Login FROM Users WHERE Login = '".$username."'";
        $result = $conn->query($sql);        

        // Make sure the username isn't already taken
        if ($result->num_rows > 0)
        {
            returnUserTaken();
        }
        else
        {
            $sql = 'INSERT INTO Users 
                (`ID`,`FirstName`,`LastName`,`Login`,`Password`) 
                VALUES 
                (DEFAULT, "'.$firstName.'", "'.$lastName.'", "'.$username.'", "'.$password.'")';

            if ( $result = $conn->query($sql) != TRUE )
            {
                returnWithError( $conn->error );
            }
            else
            {
                returnWithInfo($username, $password);
            }
        }
        
        $conn->close();      
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
        header('Content-Type: application/json');
        echo json_encode( $obj );
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
    }
    
    function returnUserTaken()
    {
        $retValue = '{"error": username exists"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $username, $password )
	{
		$retValue = '{"Username":' . $username . ',"Password":"' . $password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>