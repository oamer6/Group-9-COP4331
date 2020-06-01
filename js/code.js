var urlBase = 'http://COP4331-9.us/LAMPAPI';
var extension = 'php';

var userId = 0;		// stores the logged in user's userID
var firstName = "";	// used to display the logged in user's first name at the top of the site
var lastName = "";	// used to display the logged in user's last name at the top of the site

var contactId = 0;
var prevSearch = "";	// holds the previously searched string
var refreshSearch = false;	// states whether or not we are using "prevSearch" as our srch value (instead of grabbing it from HTML)

function doLogin()
{
	// works
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	
	// if the user does not provide a Username
	if(login.length == 0)
	{
		document.getElementById("loginResult").innerHTML = "Username field is required";
		return;
	}
	
	// if the user does not provide a password
	var password = document.getElementById("loginPassword").value;
	if(password.length == 0)
	{
		document.getElementById("loginResult").innerHTML = "Password field is required";
		return;
	}

	var hash = md5(password); // password is hashed through md5
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false); // POST, not asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// send payload to Login.php
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse(xhr.responseText);
		
		userId = jsonObject.id;
		
		// if the login credentials are incorrect
		if (userId < 1)
		{
			document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie(); // store login info in a cookie
	
		window.location.href = "contact.html"; // open the app page
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toUTCString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		// displays/updates username at top of page
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	// works
	// clear the cookie

	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addUser()
{
	// works
	var addFirstName = document.getElementById("firstName").value;
	var addLastName = document.getElementById("lastName").value;
	var username = document.getElementById("newUsername").value;
	var password = document.getElementById("newPassword").value;
	var hash = md5(password);
	
	document.getElementById("addUserResult").innerHTML = "";
	
	var jsonPayload = '{"Firstname" : "' + addFirstName + '", "Lastname" : "' + addLastName + '", "Username" : "' + username + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/AddUser.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false); // POST, not asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// send payload to AddUser.php
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse(xhr.responseText);
		
		// if the Username is taken
		if (jsonObject.error == 1)
		{
			document.getElementById("addUserResult").innerHTML = "Username already taken";
			return;
		}
		
		document.getElementById("addUserResult").innerHTML = "User added";

		saveCookie(); // store login info in a cookie

		// clear input fields
		document.getElementById("firstName").value = "";
		document.getElementById("lastName").value = "";
		document.getElementById("newUsername").value = "";
		document.getElementById("newPassword").value = "";
	}
	catch(err)
	{
		document.getElementById("addUserResult").innerHTML = err.message;
	}
}

function addContact()
{
	// works 
	var addFirstName = document.getElementById("firstName").value;
	var addLastName = document.getElementById("lastName").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var email = document.getElementById("email").value;
	var date = new Date();
	
	document.getElementById("addContactResult").innerHTML = "";

	readCookie();
	
	var jsonPayload = '{"UserID" : "' + userId + '", "Firstname" : "' + addFirstName + '", "Lastname" : "' + addLastName + '", "Phonenumber" : "' + phoneNumber + '", "email" : "' + email + '", "dateCreated" : "' + date.toUTCString() + '"}';
	var url = urlBase + '/AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // POST, asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// send payload to AddContact.php
		xhr.send(jsonPayload);
		
		// documents for the user that contact has been added
		document.getElementById("addContactResult").innerHTML = "Contact added";

		saveCookie(); // store login info in a cookie

		// clear input fields
		document.getElementById("firstName").value = "";
		document.getElementById("lastName").value = "";
		document.getElementById("phoneNumber").value = "";
		document.getElementById("email").value = "";

		// "refresh" table by re-searching previous search (so that the list may be updated after deletion)
		refreshSearch = true;
		searchContact();
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

function searchContact()
{
	// works, but needs to be modified for update and remove

	// if "refreshing" table, just use previous search; otherwise, use the text from search input field
	if (refreshSearch)
	{
		if (prevSearch == "")
		{
			return;	// don't "refresh" the table if there's nothing in the search bar
		}
		srch = prevSearch;
	}
	else
	{
		srch = document.getElementById("searchText").value;
		prevSearch = srch;	// prevSearch is used for "refreshing" table after contacts are edited or removed
	}
	refreshSearch = false;

	// if the user submits an empty search
	if(srch == "")
	{
		document.getElementById("searchContactResult").innerHTML = "Please enter a contact to search for";
		return;
	}
	document.getElementById("searchContactResult").innerHTML = "";
	
	readCookie();

	var contactList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // POST, asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				
				// if the search returns no match
				if (JSON.stringify(jsonObject.error) === JSON.stringify("No Records Found"))
				{
					document.getElementById("searchContactResult").innerHTML = "No records found";
					return;
				}
				/* Not really needed:
				// documents for the user that contact match was found
				document.getElementById("searchContactResult").innerHTML = "Contact(s) retrieved";
				*/

				// generate new table body populated with searched contacts
				var table = document.getElementById("searchTableBody");
				if (table != null)
				{
					// remove previous table body if it exists
					table.remove();
				}
				table = document.createElement("tbody");
				table.id = "searchTableBody";
				document.getElementById("searchTable").appendChild(table);
				for (var i = 0; i < jsonObject.results.length; i++)
				{
					// receive contact as JSON object
					var resultsObject = jsonObject.results[i];

					// create new row with cells
					var row = table.insertRow();
					var cellID = row.insertCell();
					var cellFirst = row.insertCell();
					var cellLast = row.insertCell();
					var cellEmail = row.insertCell();
					var cellPhone = row.insertCell();
					var cellEdit = row.insertCell();
					var cellRemove = row.insertCell();

					// populate cells
					cellID.id = "tableRow" + (i+1) + "ID";
					cellID.style = "display: none;";
					cellID.innerHTML = resultsObject.ID;

					cellFirst.id = "tableRow" + (i+1) + "First";
					cellFirst.innerHTML = resultsObject.Firstname;

					cellLast.id = "tableRow" + (i+1) + "Last";
					cellLast.innerHTML = resultsObject.Lastname;

					cellEmail.id = "tableRow" + (i+1) + "Email";
					cellEmail.innerHTML = resultsObject.Email;

					cellPhone.id = "tableRow" + (i+1) + "Phone";
					cellPhone.innerHTML = resultsObject.PhoneNum;

					// create Edit and Remove buttons and append them to their cells
					var elemLink;

					cellEdit.id = "tableRow" + (i+1) + "Edit";
					elemLink = document.createElement("a");
					elemLink.href = "#editContact";
					elemLink.setAttribute("onclick", "showUpdateContact(" + (i+1) + ");");
					elemLink.innerHTML = '<img id="iconEdit" src="images/pencil.svg" alt="Edit">';
					cellEdit.appendChild(elemLink);

					cellRemove.id = "tableRow" + (i+1) + "Remove";
					elemLink = document.createElement("a");
					elemLink.setAttribute("onclick", "removeContact(" + (i+1) + ");");
					elemLink.innerHTML = '<img id="iconRemove" src="images/trash.svg" alt="Remove">';
					cellRemove.appendChild(elemLink);
				}

				/* OLD METHOD (STRINGS)
				for (var i = 0; i < jsonObject.results.length; i++)
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementById("contactList").innerHTML = contactList;*/


			}
		};
		// send payload to SearchContact.php
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchContactResult").innerHTML = err.message;
	}
}	

function removeContact(index)
{
	readCookie();
	
	// contact data is stored in HTML table in format "tableRow#XXXX", where # is index and XXXX is variable name, like "First" or "Email"
	var remID = document.getElementById("tableRow" + index + "ID").innerHTML;
	var remFirstName = document.getElementById("tableRow" + index + "First").innerHTML;
	var remLastName = document.getElementById("tableRow" + index + "Last").innerHTML;

	// prompt for user to confirm deletion
	var prompt = confirm("Are you sure that you want to delete contact: " + remFirstName + " " + remLastName + "?");
	if(prompt)
	{
		var jsonPayload = '{"ContactID" : "' + remID + '"}';
		var url = urlBase + '/RemoveContact.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true); // POST, asynchronous
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					// documents for user that contact was deleted
					document.getElementById("removeContactResult").innerHTML = "Contact deleted";
					
					// "refresh" table by re-searching previous search (so that the list may be updated after deletion)
					refreshSearch = true;
					searchContact();
				}
			};
			// send payload to RemoveContact.php
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("removeContactResult").innerHTML = err.message;
		}
	}
	return;
}

function updateContact()
{
	// grab edited contact info from input form
	var updFirstName = document.getElementById("editFirstName").value;
	var updLastName = document.getElementById("editLastName").value;
	var updEmail = document.getElementById("editEmail").value;
	var updPhone = document.getElementById("editPhoneNumber").value;

	readCookie();
	
	// use global contactID var and grabbed contact info to make our json payload
	var jsonPayload = '{"ContactID" : "' + contactId + '", "Firstname" : "' + updFirstName + '", "Lastname" : "' + updLastName + '", "Phonenumber" : "' + updPhone + '", "email" : "' + updEmail + '"}';

	var url = urlBase + '/UpdateContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // POST, asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// documents for user that contact has been updated
				document.getElementById("updateContactResult").innerHTML = "Contact updated";
				
				// "refresh" table by re-searching previous search (so that the list may be updated after deletion)
				refreshSearch = true;
				searchContact();
			}
		};
		// send payload to UpdateContact.php
		xhr.send(jsonPayload);
		// hide HTML elements for edit contact
		document.getElementById("editContact").hidden = true;
	}
	catch(err)
	{
		document.getElementById("updateContactResult").innerHTML = err.message;
	}
}

function showUpdateContact(index)
{
	// set global contactID var so that, if we call updateContact() after this, we know which contact ID we're updating
	contactId = document.getElementById("tableRow" + index + "ID").innerHTML;

	// contact data is stored in HTML table in format "tableRow#XXXX", where # is index and XXXX is variable name, like "First" or "Email"
	var updFirstName = document.getElementById("tableRow" + index + "First").innerHTML;
	var updLastName = document.getElementById("tableRow" + index + "Last").innerHTML;
	var updEmail = document.getElementById("tableRow" + index + "Email").innerHTML;
	var updPhone = document.getElementById("tableRow" + index + "Phone").innerHTML;

	// update and display HTML elements for edit contact
	var editElement;
	editElement = document.getElementById("editContactHeader");
	editElement.innerHTML = "Editing Contact: " + updFirstName + " " + updLastName;
	editElement = document.getElementById("editFirstName");	// edit contact first name
	editElement.value = updFirstName;
	editElement.placeholder = updFirstName;
	editElement = document.getElementById("editLastName");	//edit contact last name
	editElement.value = updLastName;
	editElement.placeholder = updLastName;
	editElement = document.getElementById("editEmail");	//edit contact email
	editElement.value = updEmail;
	editElement.placeholder = updEmail;
	editElement = document.getElementById("editPhoneNumber");	//edit contact phone number
	editElement.value = updPhone;
	editElement.placeholder = updPhone;
	
	document.getElementById("editContact").hidden = false;
}

function cancelUpdateContact()
{
	// simply hide HTML elements for edit contact; input form will be reset whenever updateContact() is called again
	document.getElementById("editContact").hidden = true;
}