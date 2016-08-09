//Connection to Parse.com (Specifically the MyGroceryPal App)
Parse.initialize("hRNDGFprtpZn3OoKXdZHivCt6ZRiNSRd4WrGI1V2", "b9F2hxfq1XG6FJUOX6ojiRxRBDw6AGTnmwvu4KDR");

//Login Script
$(document).ready(function()//When page loads
{
	if(Parse.User.current())
	{
		var currentUsername = Parse.User.current().get("username");
    	$("#navDiv").append("<b>Logged-In: </b>"+currentUsername); // Insert Username into Nav to show logged in user
	}

	$("#login").click(function(event) 
	{
		event.preventDefault();
		var loginUsername = $("#login-username").val();
		var loginPassword = $("#login-password").val();
		//console.log("User Input:\n Username:"+loginUsername+"\n Password:"+loginPassword);
		Parse.User.logIn(loginUsername, loginPassword, 
		{
			success: function(User)
    		{
    			console.log("Login successful!");
    			//alert("Login Successful");
    			location.href ='Homepage.html';
    		}, 
    		error: function(User, error)
    		{
    			console.log("Login error:" + error.message);
    			alert("Invalid login details, please try again! \n Parse Error Message: " + error.message);
    		}
		});
	});

	//SignUp Script
    $("#signup").click(function(event)
    {
    	event.preventDefault();
    	var registerName = $("#signup-fullname").val();
    	var registerEmail = $("#signup-email").val();
		var registerUsername = $("#signup-username").val();
    	var registerPassword = $("#signup-password").val();
    	
    	var User = new Parse.User();
    	User.set("name", registerName);
    	User.set("email", registerEmail);
    	User.set("username", registerUsername);
    	User.set("password", registerPassword);
    	User.signUp(null, 
    	{
    		success: function(User)
    		{
    			alert("User Successfully Created");
    			location.href ='Homepage.html';
    		}, 
    		error: function(User, error)
    		{
    			console.log("Sign Up error: " + error.message);
    			alert("Sign Up error. \n Parse error message: " + error.message);
    		}
    	});
    });

	//Logout
    $("#logout").click(function() 
    {
        Parse.User.logOut();
        location.href ='index.html';
        alert("User has logged out!");
    });
});