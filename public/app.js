angular.module('CollegeTalks',[
  
    'app.routes',
    'loginService',
    'loginCtrl',
    'signUpCtrl',
    'signUpService',
    'mainCtrl',
    'mainService',
    'chatCtrl',
    'chatService',
    'profileCtrl',
    'profileService',
    'messageCtrl',
    'messageService',
    'followCtrl',
    'followService',
    'userInformationCtrl',
    'userInformationService'
    
	])

//application configuration to integrate token into requests

.config(function($httpProvider,$compileProvider){

	//attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
    //this compileProvider is used to make the unsafe:javascript() error to be removed from the chat sidebar 
     $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});