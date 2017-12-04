angular.module('userInformationService',[])

.factory('UserInformationService',function($http){

//This is the variable for the factory
var userInformationFactory ={};

//THis is used to get the information once
userInformationFactory.getAllUserInformation=function(request){
	return $http.post('/api/userInformation/getAllUserInformation',request);
}

//This is used to get the information again
userInformationFactory.getAllUserInformation1=function(request){
	return $http.post('/api/userInformation/getAllUserInformation',request);
}

//This is used to send the message to the user
userInformationFactory.postMessage=function(request){
	return $http.post('/api/message/postMessage',request);
}

return userInformationFactory;
});