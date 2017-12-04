/***************************************************************************************************************************************************************
                                                            CONTROLLER FOR THE SIGNUP BUTTON
****************************************************************************************************************************************************************/
angular.module('signUpCtrl',[])

.controller('signUpController',function($http,$state,signUp){

	var vm=this; //this is used as the $scope for the SignUpController

	vm.userCreated = false; //VARIABLE FOR THE MESSAGE IF USER IS CREATED
	vm.userExists= false; //VARIABLE FOR THE MESSAGE IF USER Exists
  vm.checkEmailBox=false;//Variable to check the input Email
  vm.checkPasswordBox=false;//Variable to check the input Password
  vm.checkUsernameBox=false;//Varaible to check the username inputbox

	/****************************************************************************************
                     FUNCTION FOR THE SIGNUP 
*****************************************************************************************/
   vm.signup=function(){
      
        var se=validateEmail(vm.UserEmail);
        if(se==false){
        	vm.checkEmailBox=true;
          vm.UserEmail.focus();
        	return false;
        }

        if(vm.Username==undefined || vm.Username.length==0){
           vm.checkUsernameBox=true;
           vm.Username.focus();
        	        	return false;
        }
        if(vm.UserPassword==undefined||vm.UserPassword.length==0){
        	vm.checkPasswordBox=true;
          vm.UserPassword.focus();
        	return false;
        }
        var request={
        	email:vm.UserEmail,
        	password:vm.UserPassword,
        	username:vm.Username
        }
        //calling of the singup function from signUp factory
   	  signUp.signup(request)
   	  .success(function(response){
           console.log(response);
           if(response.number==2)
           {
           vm.userCreated=true;
           vm.message=response.message;
            }
            if(response.number==1)
            {
            vm.userExists=true;
            vm.message=response.message;
            }
          else
          {
           vm.userExists=false;
       }
   	  }).error(function(error){

   	  })
   	};
 /*************** FUNCTION TO VALIDATE THE EMAIL **************************************/
   	function validateEmail(email){
   	 	var re= /\S+@\S.\S+/;
   	 	return re.test(email);
   	 };

});

/********************************** END OF THE SIGNUP BUTTON ********************************/