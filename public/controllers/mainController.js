angular.module('mainCtrl',[])

//create the controller as to maintain the focus on the main page

.controller('mainController',function($interval,MainService,$scope,getUserInformationService){

	//creating the this variable for the MainController

	var vm =this;


	//To take the data from the local Storage
	if(localStorage['UserData']!==undefined)
	{
		vm.user=JSON.parse(localStorage['UserData']);
	}

  
  /*********************************************************************************
                      FUNCTION TO SEND WASTE or POST 
**********************************************************************************/
//Global variable
  vm.sendWastes = function(){
    if(vm.newPosts.length==0 || vm.newPosts==undefined){
      alert("Please Enter text");
      return false;
    }

    var request={
      user:vm.user.username || vm.user.email,
      userId:vm.user._id,
      userImage:vm.user.image,
      content:vm.newPosts,
      userLike:"1",
      userDislike:"1",
      like:0,
      dislike:0
    }

    MainService.sendWastesService(request).success(function(response){
      vm.wastes=response;
      
      }).error(function(error){
           console.log(error);
      });
  };
  /************************************END OF THE WASTE FUNCTION***********************/


   /****************************************************************************************
                       FUNCTION FOR THE GET THE WASTE AT THE HOME PAGE
 *****************************************************************************************/
  //Global variable test is used to help to displayAllpost or not
  vm.test=true;
  vm.mainLoaded=false;//variable for the spinner

   function getWastes(initial){
    var data={};
    if(vm.test==true && vm.user){
      data.following=angular.copy(vm.user.following);
      data.following.push({userId:vm.user._id});
    }

    MainService.getWastesService(data).success(function(response){
    if(initial){
      console.log(response);
      vm.wastes=response;
      console.log('Here in initial');
      vm.mainLoaded=true;
    }else{
      if(response.length> vm.wastes.length){
         vm.incomingWastes = response;
         console.log(vm.incomingWastes);
         
      }
    }
    })
   };

   $interval(function(){
    getWastes(false);
    if(vm.incomingWastes){
      vm.difference=vm.incomingWastes.length - vm.wastes.length;
    }
   },5000);


   //get the intial

   getWastes(true);

/***************************************************************************************************
                     FUNCTION TO DISPLAY ALL THE POSTS
****************************************************************************************************/

//variable to isChoosed as global

vm.isChoosed=true;

vm.displayAll=function()
{
  vm.isChoosed=false;
  vm.test=false;
  getWastes();
    
 
};


/*****************************************************************************************************
               FUNCTION TO DISPLAY THE POST ONLY FOLLOWING
******************************************************************************************************/
 vm.displayOnlyFollowing=function()
{
  vm.isChoosed=true;
  getWastes();
    window.location.reload();
};

/*************************************************************************************
                   FUNCTION TO SET THE NEW POSTS TO THE CURRENT POST
**************************************************************************************/
   vm.setNewWastes=function(){
    vm.wastes = angular.copy(vm.incomingWastes);
    vm.incomingWastes = undefined;
   }

/***************************************************************************************************************
                      For the Post to be edited (EditPost()) 
**************************************************************************************************************/
// var to make the textarea view and hide the waste content 
vm.flagForEdit=1;//this is the flag to flip for getting the value of content before it changes
vm.TempPost="";//This is to hold the unchanged content used to search on the server side for updation

vm.EditPost=function(waste){
  console.log(waste);
  waste.isEditPost=true;
  vm.TempPost=waste.content;
console.log(waste.content);
  

}

vm.getResponse="";//this variable is used to get the response from the $http function as $this is not working to hold the response 

//For the posting of the edited part
vm.EditPostSubmit=function(content,waste){
   console.log(this.waste);
var request={
  content:content,
   TempPost:vm.TempPost
}
MainService.EditPostSubmitService(request).success(function(response){
vm.getResponse=response;
waste.content=vm.getResponse;
console.log(vm.getResponse);
waste.isEditPost=false;


}).error(function(err){
    console.log(err);
})




};

/************************************************************************************************************
                                       FOR THE DELETION OF THE POST
 ************************************************************************************************************/

vm.deletePost=function(content,waste){
  var request={
    content:content
  }
MainService.deletePostService(request).success(function(response){
   window.location.reload();

  }).error(function(err){

  })
}

 /****************************************End of the DeletionPost*******************************************/
//*************************************************************************************************//
   //                               for the like function                                            //
   //************************************************************************************************//
 
   $scope.imageurl1= "./public/assets/images/like.png";
   $scope.imageurl3= "./public/assets/images/like1.png";
  
   $scope.unlike=false;
   $scope.shifter=1;
   $scope.like=function(content,wastelike){
    console.log(this);
    var unlike1=0;
    if(this.shifter==1)
    {
      this.imageurl1='./public/assets/images/like1.png';
      this.unlike=true;
        this.shifter=2;
    }
    else{
      this.imageurl1='./public/assets/images/like.png';
      this.unlike = false;
      this.shifter=1;
    
      
    }
     if(this.unlike==false)
     {
    unlike1=1;
     }
     
    var request={
      posts:content,
      like:1,
      unlike:unlike1,
      userId:vm.user._id

    }
    
    MainService.likeService(request).success(function(response){
      $scope.ServerLikes=response;
      wastelike.like=angular.copy($scope.ServerLikes.like);
     
      }).error(function(err){
        console.log(err);
    })
}

$scope.isLiked=false;

$scope.checkThatFucker=function(response){
  
  for(var i=0,len=response.length;i<len;i++){
    if(response[i].likeUserId==vm.user._id){
      //this.imageurl1="images/like1.png";
      this.unlike1=true;
      this.isLiked=true;
      $scope.shifter1=2;
    }
  }
}
    
    //for the function used when the fllipped was done if the user was clicked the like button
    $scope.unlike1=false;
     $scope.shifter1=1;
    
    $scope.like1=function(content,wastelike){
      var unlike2=0;
    if(this.shifter1==1)
    {
      this.imageurl3='./public/assets/images/like1.png';
      this.unlike1=true;
        this.shifter1=2;
    }
    else{
      this.imageurl3='./public/assets/images/like.png';
      this.unlike1 = false;
      this.shifter1=1;
      
      
    }
     if(this.unlike1==false)
     {
    unlike2=1;
     }
     
    var request={
      posts:content,
      like:1,
      unlike:unlike2,
      userId:vm.user._id

    }
    
    MainService.likeService(request).success(function(response){
      $scope.ServerLikes=response;
      wastelike.like=angular.copy($scope.ServerLikes.like);
     
      }).error(function(err){
        console.log(err);
    })
    };


//***************************************************************************************************//
// THis is the function for provind the dislike function                                            //
//**************************************************************************************************//
$scope.imageurl2="./public/assets/images/dislike.png";
$scope.imageurl4="./public/assets/images/dislike1.png";

$scope.undislike=false;
 $scope.shifter3=1;
//for the dislike function
$scope.dislike = function(content,wastedislike){
  var undislike1=0;
  if(this.shifter3==1)
    {
      
      this.imageurl2='./public/assets/images/dislike1.png';
      this.undislike=true;
        this.shifter3=2;

    }
    else{
      this.imageurl2='./public/assets/images/dislike.png';
       this.undislike=false;
        this.shifter3=1;
    }
    if(this.undislike==false)
     {
    undislike1=1;
     }
    var request={
    posts:content,
    dislike:1,
    undislike:undislike1,
    userId:vm.user._id
  }

 MainService.dislikeService(request).success(function(response){
    $scope.ServerDislikes = response;
    wastedislike.dislike=angular.copy($scope.ServerDislikes.dislike);

  }).error(function(err){
    console.log(err);
  })
}


$scope.checkThatDislikeFucker=function(response){
  for(var i=0,len=response.length;i<len;i++){
    
    if(response[i].dislikeUserId==vm.user._id){
      this.imageurl="images/dislike1.png";
      this.undislike1=true;
      this.isDisliked=true;
      $scope.shifter4=2;
     
    }
  }

}

//this is the function for the flip on the undislike button
$scope.undislike1=false;
 $scope.shifter4=1;
//for the dislike function
$scope.dislike1= function(content,wastedislike){
  var undislike2=0;
  if(this.shifter4==1)
    {
      
      this.imageurl4='images/dislike1.png';
      this.undislike1=true;
       this.shifter4=2;

    }
    else{
      this.imageurl4='images/dislike.png';
       this.undislike1=false;
      this.shifter4=1;
    }
    if(this.undislike1==false)
     {
    undislike2=1;
     }
    var request={
    posts:content,
    dislike:1,
    undislike:undislike2,
    userId:vm.user._id
  }

  MainService.dislikeService(request).success(function(response){
    $scope.ServerDislikes = response;
    wastedislike.dislike=angular.copy($scope.ServerDislikes.dislike);

  }).error(function(err){
    console.log(err);
  })
}

//***************************************************************************************************************//
//**************************************************************************************************************//

/******************************************************************************************
               FUCNTION TO  GET THE COMMENT ON  A POST
*******************************************************************************************/
vm.getComment=function(content,wasteComment){

  var request={
    contents:content
  }
  MainService.getCommentService(request).success(function(response){
    vm.commentSection=response;
    console.log(vm.commentSection.comment);
    vm.commentsNo=vm.commentSection.comment.length;
    wasteComment.comment.length= angular.copy(vm.commentsNo);

  }).error(function(err){
    console.log(err);
  })
}

/*****************************END OF THE GET COMMENT*************************/

/***************************************************************************************************************
                       FUNCTION TO SET THE COMMENTS
****************************************************************************************************************/
vm.setComment = function(event,content){
  if(event.which === 13)
  {
    if(vm.goComment.newComment.length==0){
      alert("Please enter the comment");
      return false;
    }
    var request={
  comments:vm.goComment.newComment,
  userId:vm.user._id,
  userImage:vm.user.image,
  username:vm.user.username,
  content:content
                    }
                    vm.goComment.newComment="";

    MainService.setCommentService(request).success(function(response){
      vm.commentSection=response;

    }).error(function(err){
      console.log(err);
    })

}
}
/****************************** END OF THE SET COMMENT************************************/


/******************************************************************************************
               FUCNTION TO  GET THE COMMENT ON  A POST
*******************************************************************************************/
vm.getComment=function(content,wasteComment){

  var request={
    contents:content
  }
  MainService.getCommentService(request).success(function(response){
    vm.commentSection=response;
    console.log(vm.commentSection.comment);
    vm.commentsNo=vm.commentSection.comment.length;
    wasteComment.comment.length= angular.copy(vm.commentsNo);

  }).error(function(err){
    console.log(err);
  })
};

/*****************************END OF THE GET COMMENT*************************/
 /*********************************************************************************************************
                                         FOR THE DELETION OF THE COMMENT
 **********************************************************************************************************/

vm.removeComment=function(comment,content,commenting){
    var request={
    comment:comment,
    content:content
  }
  MainService.removeCommentService(request).success(function(response){
    console.log(response);
   vm.commentSection=response;

  }).error(function(err){

  })
}

/************************************************************************************************************
                        FUNCTION TO ADD THE USER INFORAMTION TO TRANSPORT TO THE INFO PAGE
 *************************************************************************************************************/

vm.addTheUser = function(theUser)
{
  console.log(theUser);
  console.log("reached the addTheUser");
  getUserInformationService.addUser(theUser);
}


   /********************End of controller***********************************************/

});