angular.module('signUpService',[])

//=====================================
// For the SignUp service to signup
//======================================

.factory('signUp',function($http){

 var signUpFactory={};


 signUpFactory.signup = function(request){

 	return $http.post('/api/profile/signup',request);
 };

 return signUpFactory;
});