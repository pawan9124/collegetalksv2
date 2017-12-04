angular.module('messageCtrl',[])

.controller('MessageController',function($scope,MessageService,getUserInformationService){

//this variable is used to take the this variable
var vm =this;

//TO GET THE DATA FROM THE LOCAL STORAGE
	if(localStorage['UserData'])
	{
		vm.user=JSON.parse(localStorage['UserData']);
		vm.userId=vm.user._id;
	}



	/*************************************************************************
                  FUNCTION FOR THE MESSAGE NOTIFICATION NUMBER
*************************************************************************/     
    if(localStorage['UserData']){
    vm.getMessagesForNotification=function()
  {
     vm.getMessagesNotificationCount();
    var request={
      userId:vm.user._id
    }
    MessageService.getMessagesForNotification(request).success(function(response){
        vm.initMessage=response;
            }).error(function(err){
      console.error(err);
    })
      }
    }
/***************************END OF THE MESSAGE NOTI NUMBER **********************/

vm.showMessageNoti=false;
vm.isMessageStatus1=false;
vm.isMessageStatus2=false;
vm.isMessageStatus3=false;
 vm.forData1=[];
 vm.forData2=[];
 vm.forData3=[];

/*********************************************************************************
                        FUNCTION FOR THE MESSAGE NOTIFICATION
**********************************************************************************/
      if(localStorage['UserData'])
      {
      vm.getMessagesNotificationCount=function(){
        var request={
          userId:vm.user._id
        }
        MessageService.getMessagesNotificationCount(request).success(function(response){
          vm.messageNoti=response;
          for(var i=0,len=response.length;i<len;i++){
              
          if(response.length>1)
          {
          vm.showMessageNoti=true;
          if(response[i].messageStatus==1){
            var hold=response[i].allData1;
            vm.forData1.push({hold});
            
            vm.isMessageStatus1=true;
          }
          if(response[i].messageStatus==2){
            var hold=response[i].allData2;
            vm.forData2.push({hold});
            
            vm.isMessageStatus2=true;
          }
          if(response[i].messageStatus==3){
            var hold=response[i].allData3;
            vm.forData3.push({hold});
            vm.isMessageStatus3=true;
          }
        }
      }
        })
      }
    }
/*********************************END OF THE MESSAGE NOTIFICATION*******************/
      //variable for the hideMessagenotification
      vm.hideMessageNoti=false;

/************************************************************************************
                     FUNCTION TO UNSET THE MESSAGE NOTIFICATION
*************************************************************************************/
  if(localStorage['UserData'])
      {
  //To unset the message notififcation
  vm.unsetMessageNotification=function(){
    var request={
      userId:vm.user._id
    }
    MessageService.unsetMessageNoti(request).success(function(response){
        vm.hideMessageNoti=true;       
    }).error(function(err){
      console.log(err);
    })
  };
}
	vm.ifSentMessageNotClicked=true;



/*************************************************************************************
                  FUNCTION FOR GETTING THE WHOLE MESSAGE
**************************************************************************************/

vm.getMessages=function(initial)
{ 
	

	var request={
		userId:vm.userId
	}
	MessageService.getMessages(request).success(function(response){
		vm.getMessages= response;
		
	}).error(function(err){
		console.error(err);
	})

}
/*************************END OF THE GETMESSAGE****************************************/
/**************************************************************************************
              FUNCTION TO THE MESSAGES WHEN SEE RECEIVED MESSAGES BUTTON CLICKED
****************************************************************************************/
vm.getMessages1=function()
{ 
	vm.ifSentMessageNotClicked=true;

	var request={
		userId:vm.userId
	}
	console.log("Start to get the message");
	MessageService.getMessages(request).success(function(response){
		vm.getMessages= response;

	}).error(function(err){
		console.error(err);
	})

}
/***************************END OF THE SENT MESSAGES************************************/
/****************************************************************************************
                           To Make it Clicked
******************************************************************************************/

vm.isClicked=false;
vm.click= function(senderId)
{
	vm.isClicked=senderId;
}

/*****************************************************************************************
                        FUNCTION TO SENT THE REPLY
******************************************************************************************/

vm.replySent=false;
$scope.sendReply = function(event,messageId)
{

	if(event.which === 13){
		var request = {
			messageId:messageId,
			contents:this.reply,
			userId:vm.userId,
			userImage:vm.user.image,
			username:vm.user.username,
			counters:1
			

		}
 console.log(request);
		MessageService.sendReply(request).success(function(response){
			console.log(response);
			vm.replySent=true;
			setInterval(myTimer, 1000);


		}).error(function(err){
			console.log(err);
		})
	}
}

function myTimer() {
    vm.replySent=false;
}

/***********************************END OF THE SENT REPLY************************************/

/*********************************************************************************************
                        FUNCTION TO GET THE SENT MESSAGES WHEN SEE SENT BUTTON CLICKED
*********************************************************************************************/

//get the sent messages
vm.getSentMessages=function()
	{
		vm.ifSentMessageNotClicked=false;
		var request={
			userId:vm.userId
		}
		
       MessageService.getSentMessages(request).success(function(response){
            vm.getMessages=response;
                      
       }).error(function(err){
       	console.error(err);
       })
	}
vm.isRead=false;

/*********************************************************************************************
                        FUNCTION TO UNSET MESSAGES NOTIFICATION
*********************************************************************************************/

	//To unset the message notififcation
 $scope.unsetMessageNoti=function(message){
    console.log("We reache notification");
    var request={
      userId:vm.user._id,
      message:message
    }
    MessageService.unsetMessageNoti(request).success(function(response){
    	console.log(response);
        vm.hideMessageNoti=true;  
        vm.isRead=true;     
    }).error(function(err){
      console.log(err);
    })
  };
  
/*******************************************END OF THE SENT MESSAGES***********************/
/******************************************************************************************
                         FUNCTION TO TOGGLE SEE REPLY BUTTON
*******************************************************************************************/

$scope.flag=false;
$scope.flipper=1;
	//toggle  button

	$scope.toggle = function(message)
	{
		 var vm =this;
		if(vm.flipper==1)
		{
        vm.flag=true;
         vm.flipper=2;
         }
         else if(vm.flipper==2)
         {
         	vm.flag=false;
         	vm.flipper=1;
         }
         $scope.unsetMessageNoti(message);
	};

/**********************************END OF THE TOGGLE BUTTON***********************/

/*******************END OF THE TOGGLE BUTTON***********************/
/*********************************************************************************
                  FUNCTION TO ADD THE USER INFORMATION TO DISPLAY USER INFO
**********************************************************************************/
	 $scope.addTheUser = function(theUser){
  getUserInformationService.addUser(theUser);
}
});//End of the message Controller