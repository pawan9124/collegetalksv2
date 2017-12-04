/*******************************************************************************************************************************************************************
                        CONTROLLER TO PROVIDE ALL THE ROUTES THAT USE TO FETCH THE PAGE
*******************************************************************************************************************************************************************/

angular.module('app.routes',['ui.router','ngFileUpload'])

//configuration for the routes provided to the user
.config(function($stateProvider,$urlRouterProvider,$locationProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider

	//signUp page
	.state('signup',{
		url:'/signup',
		templateUrl:'public/views/signup.html',
		controller:'signUpController as signup'
	})

	//mainpage
	.state('main',{
		url:'/main',
		templateUrl:'public/views/main.html',
		controller:'mainController as main'
	})

	//creating the editProfile page
	.state('editProfile',{
		url:'/editProfile',
		templateUrl:'public/views/Edit-profile.html',
		controller:'EditProfileController as profile'

	})
	//creating the messages page
	.state('message',{
		url:'/message',
		templateUrl:'public/views/message.html',
		controller:'MessageController as message'
	})
    
    //creating the follow page
    .state('follow',{
       url:'/follow',
       templateUrl:'public/views/follow.html',
       controller:'FollowController as follow'
    })
    //creating the userInformation page
    .state('userInformation',{
    	url:'/userInformation',
    	templateUrl:'public/views/userInformation.html',
    	controller:'UserInformationController as info'
    });


	//to get rid of the # sign from the url
	$locationProvider.html5Mode({
		enabled:true,
        requireBase:false
	});
});
