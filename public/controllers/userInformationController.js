/*********************************************************************************************************************************************************************
                                                 CONTROLLER FOR THE USERINFORMATION PAGE
**********************************************************************************************************************************************************************/

angular.module('userInformationCtrl',[])

.controller('UserInformationController',function($scope,UserInformationService,getUserInformationService){

	//Creating this variable for the user
	var vm=this;

  
//VARIABLES TO GET THE USER INFORMATION
vm.getTheUser  = getUserInformationService.getUser();
vm.userId=vm.getTheUser[0];
vm.universalId="";
vm.MessageSent=false;

/**************************************************************************************
                        FUNCTION FOR GET THE USER INFORMATION
**************************************************************************************/
if(localStorage['USER-INFO']==undefined)
{
//Get the all the user information
vm.getAllUserInformation=function(userId){
	vm.universalId=vm.userId;
	var request={
		userId:vm.userId
	}
	UserInformationService.getAllUserInformation(request).success(function(response){
       //window.location.reload();
		vm.allInformation=response;
		localStorage.setItem('USER-INFO',JSON.stringify({userId:response._id}));
		 console.log(vm.allInformation);
		
	}).error(function(err){
		console.log(err);
	})
}
}

/********************************* END OF THE USER INFORMATION **********************/

/**************************************************************************************
                           TO LOAD THE USERINFORMATION INTO THE VARIABLE
***************************************************************************************/
if(localStorage['USER-INFO'])
{
   vm.theUser=JSON.parse(localStorage['USER-INFO']);
   vm.userId1=vm.theUser.userId;
   getAllUserInformation1(vm.userId1);
}

/***************************************************************************************
                 FUNCTION TO GET ALL THE USERINFORMATION
****************************************************************************************/
function getAllUserInformation1(userId1){

	vm.universalId=userId1;
	var request={
		userId:userId1
	}
	UserInformationService.getAllUserInformation1(request).success(function(response){
		vm.allInformation=response;
		vm.followingCounter=response.following.length;
		localStorage.setItem('USER-INFO',JSON.stringify({userId:response._id}));
		 console.log(vm.allInformation);
	
	}).error(function(err){
		console.log(err);
	})
}

/*****************************************************************************************
                       FUNCTION TO LOAD THE CURRENT USER INFORMATION
******************************************************************************************/
//Get the user information from the local storage
if(localStorage['UserData'])
{
	vm.currentUser = JSON.parse(localStorage['UserData']);
	vm.currentUserId = vm.currentUser._id;
}


/*****************************************************************************************
                  FUNCTION TO POST THE MESSAGE FROM THE ONE USER TO ANOTHER
*****************************************************************************************/
vm.postMessage = function(){
	
	
var request={
	senderId:vm.currentUserId,
	receiverId:vm.universalId,
	senderName:vm.currentUser.username,
	senderImage:vm.currentUser.image,
	message:vm.userInfo.message,
	counter:0
}
UserInformationService.postMessage(request).success(function(response){
	console.log("The message has been post");
	vm.MessageSent=true;
}).error(function(err){
	console.log(err);
})
}

/***************************END OF THE MESSAGE FUNCTION *******************************/

/**************************************************************************************
                    FUNCTION TO GET THE DETAIL OR USERINFORMATION
***************************************************************************************/
vm.getDetail=function(clickerId){
	getAllUserInformation1(clickerId);
}

/************************** END OF THE USERINFORMATION *******************************/

/*************************************************************************************
                    TO REMOVE TEH USER-INFO FROM THE LOCAL STORAGE
**************************************************************************************/
$scope.$on("$destroy",function(){
	localStorage.removeItem('USER-INFO');
	window.location.reload();
});

/***************************** END OF THE $ON FUNCTION ******************************/

});