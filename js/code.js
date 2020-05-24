// This is the live site file
var urlBase = '/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function newUser()
{
	userId = 0;
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var userName = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	var jsonPayload = '{"FirstName":"' + firstName + '","LastName":"' + lastName + '","Login":"' + userName + '","Password":"' + hash + '"}';
	var url = urlBase + '/Register.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("userAddResult").innerHTML = "You are now Signed Up";
			}
		};
		console.log(jsonPayload);
		xhr.send(jsonPayload);

		saveCookie();
		window.location.href = "contact.html";
	}
	catch(err)
	{
		document.getElementById("userAddResult").innerHTML = err.message;
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;
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

		saveCookie();

		window.location.href = "contact.html";
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
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= , lastName =, userId = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	var phone = document.getElementById("phoneNumber").value;
	var numb = phone.match(/\d/g);
	numb = numb.join("");
	var phoneNumber = parseInt(numb);
	var email = document.getElementById("email").value;
	var newContact = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = '{"contact" : "' + newContact + '","userId" : "' + userId + '","phoneNumber":"' + phoneNumber + '","email":"' + email + '"}';
	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function editPage(id)
{
	var name = document.getElementById("fullName").value;
	var number = document.getElementById("Phonenumber").value;
	var email = document.getElementById("Email").value;
	if (name == "")
	{
		name = document.getElementById("name").innerHTML;
	}
	if (number == "")
	{
		number = document.getElementById("number").innerHTML;
	}
	if (email == "")
	{
		email = document.getElementById("emailDisp").innerHTML;
	}

	// document.getElementById("name").innerHTML = name;
	// document.getElementById("number").innerHTML = number;
	// document.getElementById("emailDisp").innerHTML = email;

	var jsonPayload = '{"Name" : "' + name + '","PhoneNumber" : "' + number + '","id" : "' + id + '","Email" : "' + email + '"}';
	var url = urlBase + '/EditContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("editResult").innerHTML = "Contact has been Updated";
				var jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.results != undefined)
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					var arr = (jsonObject.results[i]).split(" ");
					var len = arr.length;
					name = "";
					number = arr[len - 3];
					email = arr[len - 2];
					if(len == 5)
					{
						name += arr[0] + " " + arr[1];
					}
					else
					{
						name += arr[0];
					}
					document.getElementById("name").innerHTML = name;
					document.getElementById("number").innerHTML = number;
					document.getElementById("emailDisp").innerHTML = email;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}


}

function editButton(id)
{
	var jsonPayload = '{"id" : "' + id + '"}';
	var url = urlBase + '/EditSearch.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.results != undefined)
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					var arr = (jsonObject.results[i]).split(" ");
					var len = arr.length;
					var name = "";
					var number = arr[len - 3];
					var email = arr[len - 2];
					if(len == 5)
					{
						name += arr[0] + " " + arr[1];
					}
					else
					{
						name += arr[0];
					}
					document.getElementById("name").innerHTML = name;
					document.getElementById("number").innerHTML = number;
					document.getElementById("emailDisp").innerHTML = email;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function edit(id)
{
	localStorage["id"] = id;
	window.location.href = "edit.html";
}

function deleteButton(id, num2)
{
	var text = document.getElementById("results").rows[num2].cells[0].innerHTML;
	var prompt = confirm("Are you sure you want to delete " + text);
	if(prompt)
	{
		var jsonPayload = '{"id" : "' + id + '"}';
		var url = urlBase + '/DeleteContact.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.send(jsonPayload);
			location.reload();
		}
		catch(err)
		{
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
	}
}

function searchContact()
{

	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	if(!srch)
		srch="";
	var contactList = "<table name='results' id='results'>";

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				if(jsonObject.results != undefined)
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					var arr = (jsonObject.results[i]).split(" ");
					var len = arr.length;
					contactList += "<tr><td>" + arr[0]
					var j = 1;
					while (j < len - 3)
					{
						contactList += " " + arr[j];
						j++;
					}
					contactList += "</td></tr><tr><td>Phone:&emsp;" + arr[len - 3];
					contactList += "</td></tr><tr><td>Email:&emsp;" + arr[len - 2];
					contactList += "</td><td>" + buttonString(arr[len - 1], i) + "</tr><tr><td><br></td></tr>";
				}
				contactList += "</table>";
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function buttonString(id , num)
{
	var editId = "editButton";
	var deleteId = "delete" + num;
	var editText = "editText" + num;
	var editButton = "<button type='button' id='editButton' class='buttons2' onclick='edit(" + id + ")'> <ion-icon name='create'></ion-icon> </button>"; // added icon and style
	var editBar = "<span id='" + editText + "' class = 'edit'></span>"
	var deleteButton = "<button type='button' id='deleteButton' class='buttons2' onclick='deleteButton(" + id + ", " + ((num > 1)?((num - 1) * 4): (num * 4)) + ")'> <ion-icon name='trash'></ion-icon> </button><br />"; //added icon and style
	return "&emsp;</td><td>" + editButton + "</td><td>" + editBar + "</td><td>" + deleteButton + "</td>";
}
