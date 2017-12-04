angular.module('loginService',[])

//=============================================
//auth factory to login and get information
//inject $http for communication with the API
//inject $q to return promise
//inject AuthToken to manage tokens
//=============================================
.factory('Auth',function($http,$q,AuthToken,$window,$location){

	//create the auth factory object

	var authFactory ={};

	//log a user in
	authFactory.login = function(email,password)
	{
		console.log('Here in the login in services');
		//return the promise object
		return $http.post('/api/authentication/login',{
			email:email,
			password:password
		})
		.success(function(data){
			AuthToken.setToken(data.token);
			$window.localStorage.setItem('UserData',JSON.stringify(data));
			return data;
		});

	};

	//log a user out by clearing the token

	authFactory.logout =function(){
		if(localStorage['UserData'])
		{
     
		var user= JSON.parse(localStorage['UserData']);
		console.log(user._id);		    
        $http.post('/api/chat/turnActiveOff',{userId:user._id}).success(function(data){
        	console.log(data);
        if(data.flag==true)
        {
        	console.log("inside the clear");
        //clear the token
		AuthToken.setToken();//set the token
		$window.localStorage.clear();//clear the browser storage
		 $location.path('/');//change the location path
	 $window.location.reload();//Reload the window to move to the front page

	}
	
        })
        .error(function(err){
            console.log(err);
        });
       
}
		
	};

	//check if a user is logged in 
	//checks if there is a local token

	authFactory.isLoggedIn = function(){
       
       if(AuthToken.getToken())
       	return true;
       else
       	return false;
	};

	//get the logged in user
	authFactory.getUser =function(){
		if(AuthToken.getToken())
			return $window.locaStorage.getItem(UserData);
		else
			return $q.reject({message:'User has no token'});
	};
	//get all the user information
	authFactory.getChatUser =function(){
		return $http.post('/api/chat/getChatUser');

	};

	//to send the chat message to the database
	authFactory.chatMessagePost=function(data){
		return $http.post('/api/message/postMessage',data);
	}

	// //to turn the active button off

	// authFactory.turnActiveOff = function()
	// {
		
	// 	 if(localStorage['UserData'] && AuthToken.getToken())
	// 	 {
	// 	var user= JSON.parse(localStorage['UserData']);
	// 	console.log(user._id);		    
 //        return $http.post('/api/chat/turnActiveOff',{userId:user._id});
 //       }
 //       else
 //       {
 //       	return $q.reject({message:'true'});
 //       }
 //    };

   
   //return auth factory object

   return authFactory;



})

//=============================================
//factory for handling tokens
//inject $window to store token client-side
//=============================================

.factory('AuthToken',function($window){

	var authTokenFactory={};

	//get the token out of the local storage
	authTokenFactory.getToken=function(){

		return $window.localStorage.getItem('token');

	};

	//function to set the token or clear the token
	//if a token is passed, set the token
	//if there is no token, clear it  from local storage

	authTokenFactory.setToken = function(token){
        
        if(token)
        {
        	$window.localStorage.setItem('token',token);
        }
        else{
        	$window.localStorage.removeItem('token');
        }
	};

	//function to set the user information to the localStorage

	return authTokenFactory;
})

//===========================================================
// application configuration to integrate token into request
//===========================================================

.factory('AuthInterceptor',function($q,$location,AuthToken){

	var interceptorFactory ={};

	//this will happen on all HTTP requests
	interceptorFactory.request =function(config){

		//grab the token

		var token =AuthToken.getToken();

		//if the token exists, add it to the headers as x-access-token
		if(token)
			config.headers['x-access-token']=token;
		return config;
	};


	//happens on response errors
	interceptorFactory.responseError = function(response){

		//if our server return a 403 forbidden response
		if(response.status == 403){
			AuthToken.setToken();
			$location.path('/login');
		}


		//return the errors from the server as a promise
		return $q.reject(response);
	};

	return interceptorFactory;
});