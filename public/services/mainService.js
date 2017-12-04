angular.module('mainService',[])


//=========================================================================
//factory uses to serpearte the functions differently accroding to the group
//=========================================================================

.factory('MainService',function($http,$window){

   //creating a factory for the services

   var mainFactory ={};

  
  //to send the post to the database
   mainFactory.sendWastesService =function(request){
        
        return $http.post('/api/waste/posts',request);
   };

   //to get the posts that was stored in the database

   mainFactory.getWastesService=function(data){
         
        return $http.post('/api/waste/get',data);
   };

   //to send the edited post 
   mainFactory.EditPostSubmitService=function(request){
    
    return $http.post('/api/waste/UpdatePost',request);
   };

   //to delete the poset
   mainFactory.deletePostService=function(request){
    return $http.post('/api/waste/removePost',request);
   };


   //to select the like and flipped both
   mainFactory.likeService=function(request){
    
    return $http.post('/api/like/getLike',request);
   };

   //to select the dislike and flipped both
   mainFactory.dislikeService=function(request){
    return $http.post('/api/dislike/getDislike',request);
   };

   //to get the comment service
   mainFactory.getCommentService=function(request){
    
    return $http.post('/api/comments/getComments',request);
   };

   //to set the comments Service
   mainFactory.setCommentService=function(request){
    return $http.post('/api/comments/postComments',request);
   };

   //to remove the comment Service
   mainFactory.removeCommentService=function(request){
    return $http.post('/api/waste/removeComment',request);
   };

   return mainFactory;
})

//creating the factory name getUserInformation to serve the user Information around the controllers
.factory('getUserInformationService',function(){

//variable in array to hold the userinformation in array
  var userInformation=[];
  //factory  object to add the function
  var informationFactory={};

  //function to add the user information 
  informationFactory.addUser = function(user){
     return userInformation.push(user);
  };

//factory to get the userinformation
  informationFactory.getUser = function(){
    return userInformation;
  };

//return the object
  return informationFactory;
});