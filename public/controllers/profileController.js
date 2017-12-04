
/***************************************************************************************************************************************************************
                                   EDIT PROFILE CONTROLLER FOR THE EDIT PROFILE PAGE
*****************************************************************************************************************************************************************/
angular.module('profileCtrl',[])
.controller('EditProfileController',function($scope,Upload,ProfileService,getUserInformationService){

  var vm=this;//getting the instace of this controller


 vm.user = JSON.parse(localStorage['UserData']);

//for the picture alert
 vm.changePicture=false;

/******************************************************************************************
                             FUNCTION TO UPLOAD THE PICTURE
*******************************************************************************************/
/******************************************************************************************
                             FUNCTION TO UPLOAD THE PICTURE
*******************************************************************************************/
  $scope.$watch(function(){
    return vm.file
  },function(){
    vm.upload(vm.file)
  });

  vm.upload= function(file){

    if(file){
      Upload.upload({
        url:'/api/profile/editPhoto',
        method:'POST',
        data:{userId: vm.user._id},
        file:file
      }).progress(function(evt){
        console.log('uploading');
      }).success(function(data){
        console.log('He he he');
        vm.changePicture=true;
        localStorage.setItem('UserData',JSON.stringify(data));

      }).error(function(err){
        console.log(err);
      })
    }
   
  };
/********************************** END OF THE PICTURE UPLOAD********************************/

 
/******************************************************************************************
                             FUNCTION TO LOAD THE PROFILE 
*******************************************************************************************/
 vm.profileLoad=function(){
  var request={
    userId:vm.user._id
  }
    ProfileService.profileLoad(request).success(function(response){
      vm.profileLoader=response;
      console.log(response);
      vm.viewUser();
      vm.showUserName();
    }).error(function(err){
      console.log(err);
    })
 };
 /********************************** END OF LOAD THE PROFILE********************************/

/******************************************************************************************
                             FUNCTION TO DISPLAY THE USERNAME IN UPPERCASE
*******************************************************************************************/
 vm.showUserName=function(){
  
  var username=vm.user.username;
  vm.usernameInUppercase=username.charAt(0).toUpperCase()+username.slice(1);
   
 };
 /********************************** END OF  DISPLAY THE USERNAME ********************************/

/******************************************************************************************
                             FUNCTION TO GET THE USER DETAIL
*******************************************************************************************/
//for getting the user detail
vm.viewUser= function(){
    var request={
      userId: vm.user._id
    }
      ProfileService.viewUser(request).success(function(response){
        vm.detail=response;
        vm.followingCount=response.following.length;
        vm.followersCount=response.followers.length;
               }).error(function(err){
        console.log(err);
      })
   };
/******************************END OF THE USER DETAIL**************************************/


/******************************************************************************************
                             FUNCTION TO MAKE THE DATA EDITABLE
*******************************************************************************************/
 //To make the function editable
 vm.isEdit=false;
 vm.isEditable=function()
 {
  vm.isEdit=true;
 }

 /******************************END OF THE EDITABLE **************************************/

 /******************************************************************************************
                             FUNCTION TO MAKE PROFILE DATA SUBMIT
*******************************************************************************************/
  //To submit the user profile detail
  vm.error_username=false;
  vm.error_birthday=false;
  vm.error_sex=false;
  vm.error_course=false;
  vm.error_college=false;
  vm.error_year=false;
  vm.error_biography=false;

  vm.submitProfileDetail=function(){
  vm.user1 = JSON.parse(localStorage['UserData'])||undefined;

    vm.isEditable();
    if(vm.profileLoader.username==undefined ||vm.profileLoader.username.length==0)
    {
      vm.error_username=true;
      return false;
    }
    if(vm.profileLoader.birthday==undefined||vm.profileLoader.birthday.length==0)
    {
      vm.error_birthday=true;
      return false;
    }
    if(vm.profileLoader.sex==undefined||vm.profileLoader.sex.length==0)
    {
      vm.error_sex=true;
      return false;
    }
    if(vm.profileLoader.course==undefined||vm.profileLoader.course.length==0)
    {
      vm.error_course=true;
      return false;
    }
    if(vm.profileLoader.year==undefined||vm.profileLoader.year.length==0)
    {
      vm.error_year=true;
      return false;
    }
    if(vm.profileLoader.college==undefined||vm.profileLoader.college.length==0)
    {
      vm.error_college=true;
      return false;
    }
    
    if(vm.profileLoader.bio==undefined||vm.profileLoader.bio.length==0)
    {
      vm.error_biography=true;
      return false;
    }
    var request={
      userId:vm.user1._id,
      userImage:vm.user1.image,
      username:vm.profileLoader.username,
      birthday:vm.profileLoader.birthday,
           sex:vm.profileLoader.sex,
           course:vm.profileLoader.course,
           college:vm.profileLoader.college,
           year:vm.profileLoader.year,
           bio:vm.profileLoader.bio
    }
     vm.changePicture=false;

    ProfileService.submitProfileDetail(request).success(function(response){
      
       localStorage.setItem('UserData',JSON.stringify(response));
       vm.error_username=false;
  vm.error_birthday=false;
  vm.error_sex=false;
  vm.error_course=false;
  vm.error_college=false;
  vm.error_year=false;
  vm.error_biography=false;
 window.location.reload();
    }).error(function(err){
      console.log(err);
    })
  };
/******************************END OF THE SUBMIT PROFILE**************************************/

/******************************************************************************************
                             FUNCTION TO ADD THE USER FOR THE USERINFORMATION
*******************************************************************************************/
  vm.addTheUser = function(theUser)
{
   console.log(theUser);
   console.log("reached the addTheUser");
  getUserInformationService.addUser(theUser);
}
/*********************************END OF THE USERINFORMATION*****************************/


  });