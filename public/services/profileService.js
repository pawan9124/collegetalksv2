angular.module('profileService',[])

.factory('ProfileService',function($http){

  //This is the profile factory where the function is to be defined
  var profileFactory={};
 

 //Calling the profileLoad function to the profile controller
  profileFactory.profileLoad = function(data)
  {
    return $http.post('/api/profile/profileLoad',data);

  }

  //Calling the viewUser function to the profile controller

  profileFactory.viewUser = function(data){
  	return $http.post('/api/detail/getUser',data);
  }

  //Calling the submitProfileDetail function to the profile controller
  profileFactory.submitProfileDetail = function(data){
  	return $http.post('/api/profile/submitProfileDetail',data);
  }

 


return profileFactory;

});


