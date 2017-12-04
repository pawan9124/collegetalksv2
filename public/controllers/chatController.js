angular.module('chatCtrl',[])

//the controller is used to control the chat service and the controller between the chat
.controller('chatController',function(Chat){


 //creating the this variable to help to know where controller are being used
 var vm =this;
 console.log("This is chat controller");

 vm.sendChatMessage = function()
 {
 	console.log(vm.chatMessage);
 }


});