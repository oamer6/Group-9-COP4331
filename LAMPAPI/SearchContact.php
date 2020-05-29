<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	// Verify these credentials
	$conn = new mysqli("localhost", "groupnum_groupnine", "L33tNyne!", "groupnum_COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// This statement looks up a Contact from the database that either matches or begins with 
		// the subsequent character or string.
		// JSON body argument via ARC:
		// {
		//   "userId" : *Some number*,
		//   "search" : "*Some characer or string*"
		// }
		//
		$sql = "SELECT firstName,lastName,email,phoneNum,dateCreated,id from Contacts where firstName like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
		$result = mysqli_query($conn, $sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$searchCount++;
				
				if ($searchCount > 1)
				{
					$searchResults .= ',';
				}
				$searchResults .= '{"Firstname" : "' . $row["firstName"] . '",' .
				'"Lastname" : "' . $row["lastName"] . '",' .
				'"PhoneNum" : "' . $row["phoneNum"] . '",' .
				'"Email" : "' . $row["email"] . '",' .
				'"DateCreated" : "' . $row["dateCreated"] . '",' .
				'"ID" : ' . $row["id"] . '}';
			}
			
			returnWithInfo( $searchResults );

		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}

	//returnWithInfo( $searchResults );

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo ( $obj );
	}
	
	function returnWithError( $err )
	{
		$returnValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $returnValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>