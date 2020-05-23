var urlBase = 'http://COP4331-9.us/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	if(login.length == 0)
	{
		document.getElementById("loginResult").innerHTML = "Username field is required";
		return;
	}
	
	var password = document.getElementById("loginPassword").value;
	if(password.length == 0)
	{
		document.getElementById("loginResult").innerHTML = "Password field is required";
		return;
	}

	var hash = md5(password); // password is hashed
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false); // POST, not asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse(xhr.responseText);
		
		userId = jsonObject.id;
		
		if (userId < 1)
		{
			document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie(); // store login info in a cookie
	
		window.location.href = "contact.html"; // open the next page
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
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	// clear the cookie

	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addUser()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var username = document.getElementById("newUsername").value;
	var password = document.getElementById("newPassword").value;
	var hash = md5(password);
	
	document.getElementById("addUserResult").innerHTML = "";
	
	var jsonPayload = '{"Firstname" : "' + firstName + '", "Lastname" : "' + lastName + '", "Username" : "' + username + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/AddUser.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // POST, asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addUserResult").innerHTML = "User has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userAddResult").innerHTML = err.message;
	}
}

function addContact()
{
	var userID = document.getElementById("userID").value;
	var firstName = document.getElementById("firstNme").value;
	var lastName = document.getElementById("lastName").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var email = document.getElementById("email").value;
	var date = new Date();

	readCookie();
	
	locationReload();
	
	var jsonPayload = '{"UserID" : "' + userId + '", "Firstname" : "' + firstName + '", "Lastname" : "' + lastName + '", "Phonenumber" : "' + phoneNumber + '", "email" : "' + email + '", "dateCreated" : "' + date.toUTCString() + '"}';
	var url = urlBase + '/AddContact.' + extension;
	
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // POST, asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function searchContact()
{
	var srch = document.getElementById("searchText").value;
	var userID = document.getElementById("userID").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	readCookie();

	var contactList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // POST, asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchContactsResult").innerHTML = "Contact has been retrieved";
				var jsonObject = JSON.parse(xhr.responseText);
				
				for (var i = 0; i < jsonObject.results.length; i++)
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchContactsResult").innerHTML = err.message;
	}
}	

function showAllContacts()
{
	// modify search function so that it searches for an empty string
	
	
	var userID = document.getElementById("userID").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	readCookie();

	var contactList = "";
	
	var jsonPayload = '{"search" : "' + null + '","userId" : ' + userId + '}'; // search for null
	var url = urlBase + '/SearchContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // POST, asynchronous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchContactsResult").innerHTML = "Contact has been retrieved";
				var jsonObject = JSON.parse(xhr.responseText);
				
				for (var i = 0; i < jsonObject.results.length; i++)
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchContactsResult").innerHTML = err.message;
	}
}

function removeContact(id)
{
	readCookie();
	
	var prompt = confirm("Are you sure that you want to delete this contact?");
	if(prompt)
	{
		var jsonPayload = '{"id" : "' + id + '"}';
		var url = urlBase + '/DeleteContact.' + extension;


		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true); // POST, asynchronous
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("addUserResult").innerHTML = "User has been deleted";
				}
			};
			xhr.send(jsonPayload);
			location.reload();
		}
		catch(err)
		{
			document.getElementById("removeContactResult").innerHTML = err.message;
		}
	}
}

function updateContact(id)
{
	var userID = document.getElementById("userID").value;
	var firstName = document.getElementById("firstNme").value;
	var lastName = document.getElementById("lastName").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var email = document.getElementById("email").value;
	var date = new Date();

	readCookie();
	
	locationReload();
	
	var jsonPayload = '{"UserID" : "' + userId + '", "Firstname" : "' + firstName + '", "Lastname" : "' + lastName + '", "Phonenumber" : "' + phoneNumber + '", "email" : "' + email + '", "dateCreated" : "' + date.toUTCString() + '"}';
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
				document.getElementById("updateContactResult").innerHTML = "Contact has been updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateContactResult").innerHTML = err.message;
	}
}