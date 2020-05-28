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
		$sql = "SELECT firstName,lastName,email,phoneNum,dateCreated from Contacts where firstName like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
		$result = mysqli_query($conn, $sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$searchCount++;
<<<<<<< HEAD
				$searchResults .= '"' . "First name: " . $row["firstName"] .  
										" " .
										"Last name: " . $row["lastName"] .
										" " .  
										"Phone #: " . $row["phoneNum"] .
										" " . 
										"Email: " . $row["email"] .
										" " . 
										"Date created: " . $row["dateCreated"] .
								  							'"';
=======
				$searchResults .= '"' . $row["firstName"] . '"';
				
				returnWithInfo( $searchResults );
>>>>>>> d163bcf3b1fe16d9b589b1e0da15226c71255cd7
			}
		}
		else
		{
			returnNotFound();
		}
		$conn->close();
	}

	

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
<<<<<<< HEAD
		header('Content-type: application/json');
		echo json_encode( $obj );
=======
        header('Content-Type: application/json');
        echo $obj;
>>>>>>> d163bcf3b1fe16d9b589b1e0da15226c71255cd7
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnNotFound()
	{
	    $retValue = '{"error":1}';
        sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
