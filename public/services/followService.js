//This is the factory which was used to create the service
//=========================================================
angular.module('followService',[])

.factory('FollowService',function($http){
 
 //creating the variable for the service
 var followFactory ={};

 //creating the followFactory 

 followFactory.getUsers=function()
 {
 	return $http.get('/api/follow/followUser');
 }

 //creating the getFollowNotification
 followFactory.getFollowNotification=function(request){
 	return $http.post('/api/follow/getFollowNoti',request);
 }

 //creating the unsetFollowNoti for disappearing the notification
 followFactory.unsetFollowNoti=function(request){
 	return $http.post('/api/follow/unsetFollowNoti',request);
 }

 //creating the function to follow someone
 followFactory.follow=function(request){
 	return $http.post('/api/follow/followPost',request);
 }

 //creating the function to unfollow someone
 followFactory.unfollow=function(request){
 	return $http.post('/api/follow/unfollow',request);
 }


 return followFactory;

});
