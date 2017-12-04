angular.module('followCtrl',[])

.controller('FollowController',function(FollowService,getUserInformationService){
   
   //This variable is used to hold the object
   var vm = this;

  //This function is used to get the data from the local storage
 if(localStorage['UserData'])
 {
 	vm.currentUser = JSON.parse(localStorage['UserData']);
 }

 /************************************************************************
                         FUNCTION TO DISPLAY THE LIST OF USER
 ************************************************************************/
vm.getUsers=function(){
	FollowService.getUsers().success(function(response){
		vm.user=response;
		console.log(vm.user);

	}).error(function(err){
		console.log(err);
	})
};

/************************************END OF THE USER DISPLAY***********/

vm.showFollowNoti=false;//variable for the showNotification

/************************************************************************
                 FUNCTION TO GET THE FOLLOW NOTIFICATION
*************************************************************************/
if(localStorage['UserData'])
{
vm.getFollowNotification=function(){
	var request={
		userId:vm.currentUser._id
	}
	FollowService.getFollowNotification(request).success(function(response){
       vm.initFollower=response.tot;
       console.log(vm.initFollower);
       if(response.tot >= 1)
       {
       	vm.showFollowNoti=true;
       }
       vm.followDetail=response.allData.followers;
     
	}).error(function(err){
		console.log(err);
	})

}
}

/***************************End of the follow notification****************/

vm.followInit=true;//variable based for show/unshow the noti

/*******************************************************************************
                   FUNCTION TO DISAPPEAR THE NOTIFICATION
********************************************************************************/
if(localStorage['UserData'])
{
vm.unsetFollowNoti=function(){
	var request={
		userId:vm.currentUser._id
	}

	FollowService.unsetFollowNoti(request).success(function(response){
	}).error(function(err){
		console.log(err);
	})
   vm.followInit=false;
};
}
/**********************************END OF THE UNSET NOTIFICATION*****************/

/********************************************************************************
                     FUNCTION FOR THE FOLLOW TO SOMEONE
**********************************************************************************/
vm.follow = function(currentUserId,usersId,usersImage,currentUserImage,usersUsername,currentUsername)
{
	var request={
		currentUserId:currentUserId,
		usersImage:usersImage,
		currentUserImage:currentUserImage,
		currentUsername:currentUsername,
		usersUsername:usersUsername,
		otherUserId:usersId,
		counter:1		
	}
	console.log(request);
	FollowService.follow(request).success(function(response){
		localStorage.setItem('UserData',JSON.stringify(response));
		vm.follower_id=usersId;
		window.location.reload();
	}).error(function(err){
		console.log(err);
	})
};
/*************************END OF THE FOLLOW FUNCTION***********************/


/**************************************************************************
              FUNCTION TO CHECK THE USE IF FOLLOWING SOMEONE
****************************************************************************/
vm.checkIsFollowing=function(usersId){
	for(var i=0,len=vm.currentUser.following.length;i<len;i++){
		if(vm.currentUser.following[i].userId===usersId){
			
			return true;
			
		}
	}
	return false;

};
/***************************END OF THE CHECK FOLLOWING**********************/

/***************************************************************************
              FUNCTION TO UNFOLLOW USER
*****************************************************************************/

vm.unfollow=function(otherUserId)
{
	var request={
		currentUserId:vm.currentUser._id,
		otherUserId:otherUserId
	}
	FollowService.unfollow(request).success(function(response){
		localStorage.setItem('UserData',JSON.stringify(response));
		window.location.reload();
	}).error(function(err){
		console.log(err);
	})
};

/************************END OF THE UNFOLLOW USER***************************/

/****************************************************************************************
               FUNCTION TO PASS THE USERINFORMATION THROUGH SERVICE TO USERINFO PAGE
*****************************************************************************************/
vm.addTheUser = function(theUser)
{
	console.log(theUser);
	console.log("reached the addTheUser");
  getUserInformationService.addUser(theUser);
}

/***************************END OF THE ADDUSER*****************************************/
});