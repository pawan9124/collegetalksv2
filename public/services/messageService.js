angular.module('messageService',[])

.factory('MessageService',function($http){
  
   //creating the variable for the factory
   var messageFactory ={};
 

 //creating the get Message function
 messageFactory.getMessages=function(request){
 	return $http.post('/api/message/getMessages',request);
 }

 //sending the message as reply
 messageFactory.sendReply=function(request){
 	return $http.post('/api/reply/postReply',request);
 }

 //get the sendt messagees
 messageFactory.getSentMessages=function(request){
 	return $http.post('/api/sentMessages/getsentMessages',request);
 }

 //to unset the message notification
 messageFactory.unsetMessageNoti=function(request){
 	return $http.post('/api/main/unsetMessageNoti',request);
 }
 //to get the messages notification 
   messageFactory.getMessagesForNotification=function(request)
   {
    return $http.post('/api/main/messages',request);
   }
   //to get the message Notification count
   messageFactory.getMessagesNotificationCount=function(request){
    return $http.post('/api/main/getMessageNotification',request);
   }
   //to set the message notification
   messageFactory.unsetMessageNotification=function(request){
    return $http.post('/api/main/unsetMessagNoti',request);
   }
       
   
   
   return messageFactory;
});