/*********************************************************************************************************
                             LOGIN CONTROLLER IS USE TO CONTROL THE LOGIN PAGE
/*********************************************************************************************************/

angular.module('loginCtrl',[])

.controller('loginController',function($location,$http,$rootScope,Auth,$scope,$window,$compile){


	//"this" is used from the Angular 2.0 which is used as practice here
	//"this" creates an object of the loginController and uses it name in the view
	//to call the function or the variable
	//$scope is an object which is used past which can be explained as example below
	/* in controller using $scope 

	    $scope.bye = function(){
	      
	      alert('bye');

	    }
	  in view
	  <button ng-submit="bye()">click</button>

	  //using the this in controller

	  this.bye=function(){
	alert('bye');
	  }

	  <button ng-submit=loginController.bye()>click</button>
	  hence use to increase the readablity of the code
	 */


	 //get the this 

	 var vm =this;


	 vm.noLoginErrorMessage =false; //variable to check the loginMessage as loginFailed or not

     
     vm.isLoggedIn=false;
     vm.holdId="";
     vm.message="Hey there";


/************************************************************************
               FUNCTION TO CHECK WETHER THE USER IS LOGGED IN OR NOT
*************************************************************************/
if(localStorage['UserData']){
   
	 //get info if the user is logged in 
	 vm.isLoggedIn = true;
	 console.log(vm.isLoggedIn);
	vm.class="change-background";
	}
else{
	vm.isLoggedIn=false;
	console.log(vm.isLoggedIn);
	vm.class="index-background1";
	
}

	 //check to see if a user is logged in on every request
	 $rootScope.$on('$routeChangeStart',function(){
            vm.isloggedIn =Auth.isLoggedIn();

            //get user Information on route change
            Auth.getUser()
            .success(function(data){
            	console.log("Get user");
            	console.log( data);
              vm.user=data;
            });
	 });


/************************************************************************
               FUNCTION TO LOGIN USER
*************************************************************************/


	 //function to handle the login form

	 vm.loginUser =function(event){
	 	if(event.which==1||event.which==13){
	 		

	 		if(vm.email==undefined){
	 			alert("Please enter your Email");
	 			return false;
	 		}

	 		if(vm.password == undefined){
	 			alert("Please write your password");
	 			return false;
	 		}
	 	  
	 	  console.log("here in login user");

	 	//call the Auth.login() function
	 	Auth.login(vm.email,vm.password)
	 	.success(function(data){
	 		console.log(data);
	 		 if(data.success===false){
               	vm.noLoginErrorMessage=true;
               	vm.error=data.message;
               }else{
               vm.user =data;
               vm.class="change-background";
               vm.isLoggedIn =true;
               $location.path('/main');
               window.location.reload();
           }
	 	})
	 	.error(function(err){
           console.log(err);
	 	}); 


	 }//end of the if statement
	 };//end of the loginUser
/************************************************************************
               FUNCTION TO  GET ALL USERS
*************************************************************************/
vm.getChatUser =function(){
	Auth.getChatUser().success(function(allData){
       vm.currentUser=JSON.parse(localStorage['UserData']);
      vm.allUser =allData;
      console.log(vm.allUser);
	})
	.error(function(err){
      console.log(err);
	});
	
}


/************************************************************************
               FUNCTION TO LOGOUT
*************************************************************************/

vm.logout =function(){
	
			Auth.logout();

	//Auth.turnActiveOff(vm.userDetail._id);
    console.log("This is machi");
	vm.isLoggedIn=false;
	 vm.email=undefined;
	 vm.password=undefined;
	

	}


/************************************************************************
               FUNCTION TO CHECK WETHER THE TOKEN IS EXPIRED
*************************************************************************/
if(!localStorage['token'])
{
  vm.logout();


}
/************************************************************************
               FUNCTION TO CHAT A MESSAGE
*************************************************************************/



  //this function can remove a array element.
            Array.remove = function(array, from, to) {
                var rest = array.slice((to || from) + 1 || array.length);
                array.length = from < 0 ? array.length + from : from;
                return array.push.apply(array, rest);
            };
        
            //this variable represents the total number of popups can be displayed according to the viewport width
            var total_popups = 0;
            
            //arrays of popups ids
            var popups = [];

            //var to hold the temp values
            var temp=[];
        
            //this is used to close a popup
            vm.close_popup=function(id)
            {
                for(var iii = 0; iii < popups.length; iii++)
                {
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);
                        
                        document.getElementById(id).style.display = "none";
                        
                        calculate_popups(id);
                        
                        return;
                    }
                }   
            }
        
            //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
            function display_popups()
            {
                var right = 220;
                
                var iii = 0;
                for(iii; iii < total_popups; iii++)
                {
                    if(popups[iii] != undefined)
                    { 
                      

                        var element = document.getElementById(popups[iii]);
                        element.style.right = right + "px";
                        right = right + 320;
                        element.style.display = "block";
                    }
                }
                
                for(var jjj = iii; jjj < popups.length; jjj++)
                {
                    var element = document.getElementById(popups[jjj]);
                    element.style.display = "none";
                }
            }
            
            //creates markup for a new popup. Adds the id to popups array.
      vm.register_popup =function(id, name)
                            {
            	console.log(name);
            	console.log(id);
            	$scope.message="Hello jaani";
                
                for(var iii = 0; iii < popups.length; iii++)
                {   
                    //already registered. Bring it to front.
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);
                    
                        popups.unshift(id);

                        
                        calculate_popups(id);
                        
                        
                        return;
                    }
                }               
                
                var element = '<div ng-controller="loginController as chat " ng-init="chat.getThis(\''+name+'\')" class="popup-box chat-popup" id="'+ id +'">';
                element = element + '<div class="popup-head">';
                element = element + '<div class="popup-head-left">'+ name +'</div>';
                element = element + '<div class="popup-head-right"><a ng-click="login.close_popup(\''+ id +'\');">&#10005;</a></div>';
                element = element + '<div style="clear: both"></div></div><div id="pig" class="popup-messages"><div id="messageLola'+name+'"></div></div>\
                <div class="chatInput"><input type="text" class="inputText" placeholder="Enter message" ng-model="this.chat.lola"><button class="button" ng-click="chat.sendChat(\''+id+'\',\''+name+'\')">Send</button>\
                </div>\
                </div>'

                var temp=$compile(element)($scope); //compiled the above string HTML to make it live for the controller{{ object }} can be used . 
                console.log(temp[0]);
                console.log("thhis for the name:"+name);
                console.log(this);

               var temp2= document.getElementsByTagName("body")[0];
               temp2.appendChild(temp[0]) ; 
        
                popups.unshift(id);
                        
                calculate_popups();

                console.log(popups);
                
                 return this;
                
            }
            
            //calculate the total number of popups suitable and then populate the toatal_popups variable.
            function calculate_popups()
            {
                var width = window.innerWidth;
                if(width < 540)
                {
                    total_popups = 0;
                }
                else
                {
                    width = width - 200;
                    //320 is width of a single popup box
                    total_popups = parseInt(width/320);
                }
                
                display_popups();
                
            }
            
            //recalculate when window is loaded and also when window is resized.
            window.addEventListener("resize", calculate_popups);
            window.addEventListener("load", calculate_popups);



/************************************************************************
               FUNCTION TO  SEND CHAT CONTENT
*************************************************************************/

/* This function is  used to chat the message*/






//function to send the chat message and then use to append to the div id of the message box

//vm.messageList1=[];
 //vm.messageList =[];
 var timeLimit=true;
vm.sendChat=function(id,name){
//document.getElementById('lol').innerHTML=vm.chatMessage;
vm.logUser=JSON.parse(localStorage['UserData']);

  //vm.messageList.push({senderName:vm.logUser.username,message:vm.lola});
   //console.log(vm.lola);
   //vm.messageList1.push({message:vm.lola,receiverId:id,receiverName:name,senderId:vm.logUser._id,senderName:vm.logUser.username});
   //console.log(vm.messageList);

 var name2="messageLola"+name;
$('#'+name2).append("<div><strong>"+vm.logUser.username+"</strong>:"+vm.lola+"</div>");

   var data={
    message:vm.lola,
    receiverId:id,
    senderId:vm.logUser._id,
    receiverName:name,    
    senderName:vm.logUser.username,
    senderImage:vm.logUser.image,
    counter:0
   }
   console.log(data);
 
   Auth.chatMessagePost(data).success(function(data){
    console.log(data);
   })
   .error(function(err){
    console.log(err);
   });
   socket.emit('sendMessage',data);

   //console.log(vm.messageList);
   vm.lola='';
}

/************************************************************************
               FUNCTION TO  RECEIVE THE MESSAGE
*************************************************************************/

//Receiving the message

socket.on('receiveMessage',function(data){

 
  console.log(data);

vm.logUser2=JSON.parse(localStorage['UserData']);
if(vm.logUser2.username!== data.senderName && vm.logUser2.username==data.receiverName)
{

vm.register_popup(data.senderId,data.senderName);


}

var name="messageLola"+data.senderName;
//var $messageId = $('#'+name);
//console.log(name);
//console.log($messageId);
if(vm.logUser2.username== data.receiverName && timeLimit==true)
{
$('#'+name).append("<div><strong>"+data.senderName+"</strong>:"+data.message+"</div>")
timeLimit=false;
}

// for(i=0;i<=data.length;i++)
// {
//  if( vm.logUser2.username==data[0].receiverName )
//  {
//   if(i==data.length-1)
//   {

// vm.messageList.push({senderName:data[i].senderName,message:data[i].message});
// console.log(vm.messageList);
// }
// }
// }

});





});


