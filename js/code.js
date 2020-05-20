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
	
	alert(login); // do not leave this in! Prof will have a heart attack! For testing, only!
	
	var password = document.getElementById("loginPassword").value;
	
	alert(password); // do not leave this in! Prof will have a heart attack! For testing, only!

	var hash = md5( password ); // password is hashed

	alert(hash); // do not leave this in! Prof will have a heart attack! For testing, only!
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	/*
	COMMENTED OUT UNTIL BACK END IMPLEMENTED
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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
	*/
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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
	var firstName = document.getElementById("firstNme").value;
	var lastName = document.getElementById("lastName").value;
	var username = document.getElementById("newUsername").value;
	var password = document.getElementById("newPassword").value;
	var hash = md5( password );
	
	document.getElementById("addUserResult").innerHTML = "";
	
	var jsonPayload = '{"Firstname" :"'+ firstName + '", "Lastname" : "' + lastName + '", "Username" : "' + username + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/AddUser.' + extension;
	
	/*
	COMMENTED OUT UNTIL BACK END IMPLEMENTED
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
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
	*/
}

function addContact()
{
	var firstName = document.getElementById("firstNme").value;
	var lastName = document.getElementById("lastName").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var email = document.getElementById("email").value;
	var city = document.getElementById("city").value;
	var state = document.getElementById("state").value;
	var zip = document.getElementById("zip").value;
	var country = document.getElementById("country").value;
	readCookie();
	
	locationReload();
	
	var jsonPayload = '{"UserID" : '" + userId + '", "Firstname" :"'+ firstName + '", "Lastname" : "' + lastName + '", "phoneNumber" :"'+ phoneNumber + '", "email" : "' + email + '", "city" :"'+ city + '", "state" : "' + state + '", "zip" :"'+ zip + '", "country" : "' + country + '"}';
	var url = urlBase + '/AddContact.' + extension;
	
	/*
	COMMENTED OUT UNTIL BACK END IMPLEMENTED
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
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
	*/
}

function searchContact()
{
	firstName = document.getElementById("firstName").value;
	lastName = "";
	phone = "";
	
	var contactList = "";
	
	readCookie();
	
	var jsonPayload = '{"UserID" : '" + userId + '", "Firstname" :"'+ firstName + '", "Lastname" : "' + lastName + '", "phoneNumber" :"'+ phoneNumber + '", "email" : "' + email + '", "dateCreated" : "' + dateCreated + '"}';
	var url = urlBase + '/SearchContacts.' + extension;
	
	/*
	COMMENTED OUT UNTIL BACK END IMPLEMENTED
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
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
	*/
}	
