/********************************************************************************************************************************************************
                                        BACKEND OUR API FOR THE ROUTES AND FUNCTION 
 ********************************************************************************************************************************************************/

 /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                     => This from now the start of the routes which belongs the models.
                                     => All the routes in this api js are scheduled accroding to the routes per model based
                                     => First the user model related routes are arranged so that the routes which using users.
                                        are on the top.
                                     => After that the Posts routes are handles which is mainly used in the home page for handling the posts.
                                     => And the last one is for the message routes which to be handled.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

/********************************************************************************************************************************************************
                                   Modules that are required for the API Support
 *********************************************************************************************************************************************************/

var User = require('../models/users');//importing the user model from the app/model/user directory
var Message = require('../models/messages');//get the message instance
var Waste = require('../models/posts');//get the posts module from the models
var Chat = require('../models/chat');//get the chat module from the models
var jwt = require('jsonwebtoken');//jsonwebtoken is  used to create  token for the user
var multiparty = require('connect-multiparty');//connect multiparty is the term used to upload the picture
var multipartyMiddleware = multiparty();//this multipart is used to create an  instance of mulitparty 
var fs = require('fs-extra');//fs is used to server the file to the server
var path = require('path');//path is required to serve the path for the application
var config = require('../../config');//configuration file 
var mv = require('mv');//THis is the mv to upload the file


/********************************************************************************************************************************************************
                                   SECRET TOKEN
 *********************************************************************************************************************************************************/

var superSecret = config.secret;

/********************************************************************************************************************************************************
                                   BEGNNING OF THE ROUTES
 *********************************************************************************************************************************************************/

module.exports=function(app,express){

	/********************************************************************************************************************************************************
                        API ROUTER CREATION FOR THE APPLICATION
*********************************************************************************************************************************************************/

//THE CREATION OF THE API ROUTER

var apiRouter = express.Router();

/********************************************************************************************************************************************************
                            ROUTES TO TURN ACTIVE OFF
*********************************************************************************************************************************************************/
apiRouter.post('/chat/turnActiveOff',function(req,res){
  
  Chat.remove({userId:req.body.userId},function(err,data){
      
      if(err)
      {
        res.send(err);
      }
      else
      {
        

        res.json({flag:true});
      }

  });
});


/********************************************************************************************************************************************************
                          ROUTES FOR THE AUTHENTICATION FIRST AND PROVIDE TOKEN
*********************************************************************************************************************************************************/
//This Routes helps to authenticate the user from the database
apiRouter.post('/authentication/login',function(req,res,next){

	//find the user
	//select the name username and password explicitly

	User.findOne({
		email:req.body.email
	}).select('email _id image following followers username password').exec(function(err,user){

		if(err)
			throw err;

		//no user with that username was found
		if(!user){
			res.json({
				success:false,
				message:'User not found.'
			});
		}else if(user){

			//check if the password matches
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword){
				res.json({
					success:false,
					message:'Wrong password.'
				});
			}else{

				//if user is found and password is right
				//create a token
				var token =jwt.sign({
					name:user.name,
					username:user.username
				},superSecret,{
					expiresIn:1400//expires in 24 hours
				});
         
        //Chat model is called to ensure that save the log isActive detail to give the user who is active

        
         var chat = new Chat();//creating the new chat object

          chat.userId = user._id;
          chat.username=user.username;
          chat.userImage =user.image;
          chat.isActive ="on";
          chat.save(function(err){
            if(err)
            {
              res.json(err);
            }
            next();
          });
        
       

				//return the information including token as JSON
				res.json({
					email:user.email,
					_id:user._id,
					username:user.username,
					image:user.image,
					following:user.following,
					followers:user.followers,
					success:true,
					message:'Enjoy your token',
					token:token,
          chat:chat
				});
				
			}

		}
	})
	
			
});

/********************************************************************************************************************************************************
                          ROUTES FOR THE SIGNUP
*********************************************************************************************************************************************************/


//API FOR THE SIGNUP OR THE CREATION OF THE  USER
apiRouter.post('/profile/signup',function(req,res){


//create a new instance of the User model
var user = new User();

  user.email = req.body.email;
  user.username = req.body.username;
  user.password = req.body.password;    

    //save the user and check for errors
    user.save(function(err){
      if(err){
        //check for the duplicate entry
        if(err.code ==11000)
        {
          
          return res.json({sucess:false,message:'! Email already exists',number:1});

        }
        else{
          return res.send(err);
        }

      }


      res.json({message:'User Created',number:2});
    })
   




});


/********************************************************************************************************************************************************
                        MIDDLEWARE IN THE APIROUTER FOR VERIFYING THE TOKEN
*********************************************************************************************************************************************************/

//ROUTE MIDDLEWARE TO  VERIFY A TOKEN(USE IT AFTER THE AUTHENTICATION AND BEFORE THE OTHER ROUTES AS IT IS A MIDDLEWARE)
//=============================================
apiRouter.use(function(req,res,next){

	//check header on url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	//decode token
	if(token){

		//verifies secret and checks exp
		jwt.verify(token,superSecret,function(err,decoded){
             if(err){
             	return res.status(403).send({
             		success:false,
             		message:'Failed to authenticate token'
             	});
             }else{

             	//if everything is good, save to request for use in other routes
             	req.decoded= decoded;

              // res.json({message:'your token has been verified'});
              console.log("Reached at token");
             //	next();


             }
		});
	}else{

		//if there is no token
		//return an HTTP response of 403(access forbidden) and  an error message
		return res.status(403).send({
			success:false,
			message:'No token provided.'
		});
	}

	next();

});





/**************************************EDIT PROFILE SECTION**********************************************************************************************
=========================================================================================================================================================
=========================================================================================================================================================*/



/********************************************************************************************************************************************************
                        UPLOADING THE IMAGE
*********************************************************************************************************************************************************/
apiRouter.post('/profile/editPhoto',multipartyMiddleware,function(req,res){
     
     
       var file= req.files.file;
       var userId= req.body.userId;

       var tempPath = file.path;       

       var targetPath = path.join(__dirname,"../../uploads/"+userId+file.name);
       var savePath  = "/uploads/"+userId+file.name;
       mv(tempPath,targetPath,function(err){
       	if(err){
       		console.log(err);
       	}else{
       		User.findById(userId,function(err,userData){
       			var user=userData;
       			user.image=savePath;
       			user.save(function(err){
       				if(err){
       					res.json({status:500});
       				}else{
       					res.json(user);
       				}
       			});
       		});
       	}
      });

});

/********************************************************************************************************************************************************
                         UPDATE THE PROFILE INFORMATION
*********************************************************************************************************************************************************/
apiRouter.post('/profile/submitProfileDetail',function(req,res){
var userId = req.body.userId;
	var image=req.body.userImage;
	var username = req.body.username;
	var birthday=req.body.birthday;
	var sex=req.body.sex;
	var course=req.body.course;
	var year=req.body.year;
	var college=req.body.college;
	var bio=req.body.bio;
	
	//This function is used to update the pics and username on the waste post 
	Waste.find({userId:userId},function(err,userData){

     for(var i=0,len=userData.length;i<len;i++)
     {
     	userData[i].userImage=image;
     	userData[i].username=username;

     	     userData[i].save();
     }
     //end loop
          
  })
//This function is used to update the pics and username on the waste post comment
	Waste.find({},function(err,allData){
       for(var i=0,len=allData.length;i<len;i++){
           for(var j=0,len1=allData[i].comment.length;j<len1;j++)
           {
           	 if(allData[i].comment[j].userId===userId)
           	 {
           	 	 allData[i].comment[j].postImage=image;
           	 	 allData[i].comment[j].postName=username;
           	 	 allData[i].save();
           	 }
           }
       	   
       }

	})


//to udpdate in the message

Message.find({},function(err,allData){
	if(err){
		res.json(err);
	}else{
		for(var i=0,len=allData.length;i<len;i++){
      		
                	if(allData[i].senderId===userId){
                		allData[i].senderImage=image;
                		allData[i].senderUsername=username;
                		allData[i].save();
                	}
                	if(allData[i].receiverId===userId){
                		allData[i].receiverImage=image;
                		allData[i].receiverUsername=username;
                		allData[i].save();
                	}

                	for(var j=0,len1=allData[i].reply.length;j<len1;j++){
                		if(allData[i].reply[j].replyerId===userId)
                		{
                			allData[i].reply[j].replyerImage=image;
                			allData[i].reply[j].replyerUsername=username;
                			allData[i].save();

                		}

                	}//end of j loop
                 	
	}//end of i loop
}//end  of else
})
	//updating the username and image on the User following users followers part
	User.find({},function(err,allData){
      if(err){
      	res.json(err);
      }
      else{
      	for(var i=0,len=allData.length;i<len;i++){
      		
      	    for(var j=0,len1=allData[i].followers.length;j<len1;j++){
      	    	  if(allData[i].followers[j].userId===userId){
      	    	  	allData[i].followers[j].followersImage=image;
      	    	  	allData[i].followers[j].username=username;
      	    	  	allData[i].save();
      	    	  }

      	    }	//end of j loop

      	    for(var k=0,len2=allData[i].following.length;k<len2;k++){
      	    	if(allData[i].following[k].userId===userId){
      	    	  	allData[i].following[k].followingImage=image;
      	    	  	allData[i].following[k].username=username;
      	    	  	allData[i].save();
      	    	  }

      	    }//end of k loop
        
      		}//end of for i

      	}//end of else

	});

  //This function is used to update the chat User and Image

 Chat.find({userId:userId},function(err,userData){
    console.log(userData);
  userData[0].username=username;
  userData[0].userImage=image;
  userData[0].save(function(err){
    if(err)
    {
      res.send(err);
          }
     });
  });


	
  	User.findById(userId,function(err,userData){
		var user= userData;
		user.username= username;
		user.birthday=birthday;
		user.sex=sex;
		user.course=course;
		user.year=year;
		user.college=college;
		user.bio=bio;
		user.save(function(err){
			if(err){
				res.json({status:500});
			}else{
				res.json(user);
			}
		})
	});
  

});
/************************************* END OF THE UPDATE PROFILE FUNCTION *************************************/




/********************************************************************************************************************************************************
                         ROUTES TO GET THE USER INFORMATION(PERSONAL INFORMATION)
*********************************************************************************************************************************************************/

apiRouter.post('/profile/profileLoad',function(req,res){

	var userId = req.body.userId;

	User.findById(userId,function(err,allData){
		if(err){
			console.log(err);
		}else{
			res.json(allData);
		}

	});

});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  END OF EDIT PROFILE SECTION ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/



/************************************* USER DETAIL SECTION ********************************************************************************************
=========================================================================================================================================================
=========================================================================================================================================================*/



/********************************************************************************************************************************************************
                         ROUTES TO GET THE USER INFORMATION AND ALL USER INFORMATION)
*********************************************************************************************************************************************************/

apiRouter.post('/detail/getUser',function(req,res){

	userId = req.body.userId;
	User.findById(userId,function(err,userData){
       var user= userData;
		if(err){
			res.json(err);
		}else{
		res.json(userData);
	} 
	});
});
/********************************************************************************************************************************************************
                         ROUTES TO GET THE ALL USER INFORMATION 
*********************************************************************************************************************************************************/
apiRouter.get('/detail/getAllUser',function(req,res){
     
     User.find({},function(err,userData){
		if(err){
			res.json(err);
		}
		else{
			res.json(userData);
		}
	});
   
});


/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  END OF USER DETAIL SECTION ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/



/************************************** FOLLOW/UNFOLLOW USERS ROUTES SECTION******************************************************************************
=========================================================================================================================================================
=========================================================================================================================================================*/



/********************************************************************************************************************************************************
                          GET ALL USERS IN FOLLOW ROUTES
*********************************************************************************************************************************************************/
apiRouter.get('/follow/followUser',function(req,res){

   User.find({})
	.sort({date:-1})
	.exec(function(err,allData){
		if(err){
			res.json(err);
		}else{
			res.json(allData);
		}
	});

});


/********************************************************************************************************************************************************
                          ROUTES POSTFOLLOW IS USED TO FOLLOW A USER
*********************************************************************************************************************************************************/
apiRouter.post('/follow/followPost',function(req,res){

  var  currentUserId = req.body.currentUserId;
  var  otherUserId = req.body.otherUserId;
  var  currentUsername =req.body.currentUsername;
  var usersUsername = req.body.usersUsername;
  var currentUserImage=req.body.currentUserImage;
  var usersImage=req.body.usersImage;
  var counter=req.body.counter;
  
User.findById(otherUserId,function(err,otherUser){
    if(err){
      console.log(err);
    }else{
      otherUser.followers.push({userId:currentUserId,username:currentUsername,followersImage:currentUserImage,counter:counter});
      otherUser.save();
   
          
    }
  });
  User.findById(currentUserId,function(err,currentUser){
    if(err){
      console.log(err);
    }else{
      currentUser.following.push({userId:otherUserId,username:usersUsername,followingImage:usersImage});
            currentUser.save();
      res.json(currentUser);

    }
  });



});
/********************************************************************************************************************************************************
                          USING THAT ROUTER WITH APIROUTER
*********************************************************************************************************************************************************/
apiRouter.post('/follow/unfollow',function(req,res){
  var currentUserId = req.body.currentUserId;
  var otherUserId = req.body.otherUserId;
  User.findById(currentUserId,function(err,allData){
    if(err){
      console.log(err);
    }else{
    allData.following.pop({userId:otherUserId});
    allData.save();
    res.json(allData);

  }
});

});


/********************************************************************************************************************************************************
                          ROUTES TO GET THE FOLLOW NOTIFICATION
*********************************************************************************************************************************************************/
//This is used to get the notification of the users follow
apiRouter.post('/follow/getFollowNoti',function(req,res){
 
         var userId=req.body.userId;
  var tot=0;
  User.findById(userId,function(err,allData){
    if(err){
      console.log(err);
    }else{
      
    for(var i=0,len=allData.followers.length;i<len;i++){
       if(allData.followers[i].counter!==undefined)
       tot=tot+allData.followers[i].counter;

    }
    res.json({tot,allData});
  }
  });

});



/********************************************************************************************************************************************************
                          ROUTES TO UNSET THE FOLLOW NOTIFICATION
*********************************************************************************************************************************************************/

apiRouter.post('/follow/unsetFollowNoti',function(req,res){
  var userId=req.body.userId;
  User.findById(userId,function(err,allData){
    if(err){
      console.log(err);
    }else{
      for(var i=0,len=allData.followers.length;i<len;i++){
        if(allData.followers[i].counter!==undefined)
          allData.followers[i].counter=0;

      }
      allData.save();
    }
  });

});


/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  END OF FOLLOW USERS ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/


/************************************** USER INFORMATION ROUTES SECTION******************************************************************************
=========================================================================================================================================================
=========================================================================================================================================================*/

/********************************************************************************************************************************************************
                          USER INFORMATION POST
*********************************************************************************************************************************************************/

//get the user information
apiRouter.post('/userInformation/getAllUserInformation',function(req,res){
    var userId = req.body.userId;
User.findById(userId,function(err,allData){
  if(err){
    console.log(err);
  }
  else{
    
    res.json(allData);
  }
});

});

/********************************************************************************************************************************************************
                          USER INFORMATION PAGE TO POST MESSAGE
*********************************************************************************************************************************************************/
apiRouter.post('/userInformation/postMessage',function(req,res){

   var receiverUsername="";
   var receiverImage="";
  User.findById(req.body.receiverUserId,function(err,allData){
               if(err){
                res.json(err);
               }else{
             
                receiverImage=allData.image;
                receiverUsername=allData.username;
                var message= new Message(); 
  message.receiverId= req.body.receiverUserId;
  message.senderId = req.body.senderUserId;
  message.message= req.body.message;
  message.senderImage=req.body.image;
  message.senderUsername=req.body.username;
  message.receiverUsername=receiverUsername;
  message.receiverImage=receiverImage;
  message.counter=req.body.counter+1;
  message.save();
  res.json(message);
               }
  });

});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  END OF USERINFORMATION xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/




/*=========================================================================================================================================================

                                                   BEGINNING OF THE POSTS ROUTES IN SERVER SIDE FOR THE MAIN CONTROLLER
                                                ***********************************************************************
                                                ***********************************************************************
=============================================================================================================================================================*/



/********************************************************************************************************************************************************
                          ROUTES TO POST THE WASTE
*********************************************************************************************************************************************************/

apiRouter.post('/waste/posts',function(req,res){
  console.log("get to the waste");
  var waste = new Waste();
    waste.user=req.body.user;
    waste.userId=req.body.userId;
    waste.userImage=req.body.userImage;
    waste.content=req.body.content;
    waste.like=req.body.like;
    waste.dislike=req.body.dislike;
    waste.userLike.push({likeUserId:req.body.userLike});
    waste.userDislike.push({dislikeUserId:req.body.userDislike});
  waste.save();
    Waste.find({})
    .sort({date:-1}).exec(function(err,allWastes){
      if(err){
        res.error(error);
      }else{
        res.json(allWastes);
        }
    });


});

/********************************************************************************************************************************************************
                          ROUTES TO GET THE WASTE
*********************************************************************************************************************************************************/
apiRouter.post('/waste/get',function(req,res){

  if(!req.body.following){
Waste.find({})
.sort({date:-1})
.exec(function(err,allWastes){
  if(err){
    res.error(err);
  }else{
    res.json(allWastes);
    
  }
})
}
else{
    var requestedWastes=[];
    for(var i=0,len=req.body.following.length;i<len;i++){
        requestedWastes.push({userId:req.body.following[i].userId});
    }
    Waste.find({$or:requestedWastes})
    .sort({date:-1})
    .exec(function(err,allWastes){
        if(err){
            res.error(err);
        }else{
            res.json(allWastes);
        }
    })
}

});


/********************************************************************************************************************************************************
                          ROUTES TO UPDATE THE WASTE IN THE WASTE SECTION
*********************************************************************************************************************************************************/
apiRouter.post('/waste/updatePost',function(req,res){

   var tempPost=req.body.TempPost;
    var content=req.body.content;

    Waste.find({content:tempPost},function(err,data){
        if(err){
            res.json(err);
        }else{
            var post=data[0];
            post.content=content;
            post.save();
            res.json(post.content);
        }
    })


});

/********************************************************************************************************************************************************
                          ROUTES TO DELETE THE POST IN THE WASTE SECTION
*********************************************************************************************************************************************************/

apiRouter.post('/waste/removePost',function(req,res){

  var content=req.body.content;
    Waste.remove({content:content},function(err,allData){
        if(err){
            res.json(err);
        }else{
            res.json(allData);
        }
    })

});


/********************************************************************************************************************************************************
                          ROUTES TO DELETE THE COMMENT FROM THE WASTE SECTION
*********************************************************************************************************************************************************/

apiRouter.post("/waste/removeComment",function(req,res){

  var commentText =req.body.comment;
    var content=req.body.content;
    Waste.find({content:content},function(err,allData){
        if(err){
            res.json(err);
        }else
        {
            allData[0].comment.pop({commentText:commentText});
               allData[0].save();
               res.json(allData);
            
        }
    })

});

/********************************************************************************************************************************************************
                          ROUTES TO GET THE POSTS OF THE FOLLOWING USERS
*********************************************************************************************************************************************************/

apiRouter.post('/waste/getFollowingWastes',function(req,res){

var requestedWasterId=[];
    for(var i=0,len=req.body.following.length;i<len;i++)
    {
        requestedWasterId.push({userId:req.body.following[i].userId});
    }
    Waste.find({$or: requestedWasterId})
    .sort({date:-1})
    .exec(function(err,allWastes){
        if(err){
            res.error(err);
        }else{
            res.json(allWastes);
        }
    })

});

/********************************************************************************************************************************************************
                           POSTS TO GET THE LIKE AND UPLOAD THE DETAIL FOR LIKE BUTTON
*********************************************************************************************************************************************************/

apiRouter.post('/like/getLike',function(req,res){
  var contents= req.body.posts;
  var unlike=req.body.unlike;
  var status= req.body.myStatus;
  var userId=req.body.userId;
  Waste.find({content:contents},function(err,allData){
    var First= allData[0];
    if(unlike==0)
    {
    var tempLike1= parseInt(First.like);
      var tempLike2= req.body.like;
     var finalLike = tempLike1+tempLike2;
     finalLike =""+finalLike;
       First.like=finalLike;
       First.userLike.push({likeUserId:userId});
    }
    if(unlike ==1)
    {
      var tempLike1= parseInt(First.like);
      var tempLike2= req.body.unlike;
     var finalLike = tempLike1-tempLike2;
     finalLike =""+finalLike;
       First.like=finalLike;
       First.userLike.pop({likeUserId:userId});
    }
    First.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.json(First);
      }
    })
    
       
  });

});

/********************************************************************************************************************************************************
                  ROUTES TO GET THE DISLIKE AND UPLOAD THE DISLIKE BUTTON DATA
*********************************************************************************************************************************************************/
apiRouter.post('/dislike/getDislike',function(req,res){

  var contents  = req.body.posts;
  var undislike = req.body.undislike;
  var userId= req.body.userId;
  Waste.find({content:contents},function(err,allData){
        var First = allData[0];
        if(undislike==0)
        {
    var tempDislike1 = parseInt(First.dislike);
    var tempDislike2 = req.body.dislike;
    var finalDislike = tempDislike1+tempDislike2;
    finalDislike=""+finalDislike;
    First.dislike= finalDislike;
    First.userDislike.push({dislikeUserId:userId});
  }
  if(undislike==1)
        {
    var tempDislike1 = parseInt(First.dislike);
    var tempDislike2 = req.body.undislike;
    var finalDislike = tempDislike1-tempDislike2;
    finalDislike=""+finalDislike;
    First.dislike= finalDislike;
    First.userDislike.pop({dislikeUserId:userId});
  }
    First.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.json(First);
    }
    })
  });

       
});

/********************************************************************************************************************************************************
                       ROUTES TO GET THE COMMENTS 
*********************************************************************************************************************************************************/
apiRouter.post('/comments/getComments',function(req,res){

  var content=req.body.contents;
  Waste.find({content:content},function(err,allData){
    var First=allData[0];
    res.json(First);
  })

});


/********************************************************************************************************************************************************
              RUOTES FOR THE COMMENT SECTION TO POST THE COMMENT
*********************************************************************************************************************************************************/

apiRouter.post('/comments/postComments',function(req,res){

  var userId = req.body.userId;
  var contents = req.body.content;
  var comment = req.body.comments;
  var userImage = req.body.userImage;
  var username=req.body.username;

  Waste.find({content:contents},function(err,allData){
    var First = allData[0];
    First.comment.push({userId:userId,commentText:comment,postImage:userImage,postName:username});
  
    First.save(function(err){
      if(err){
        console.log(err);
      }else{
      
        res.json(First);
      }
    })
  });

});


/*=========================================================================================================================================================

                                                   BEGINNING OF THE MESSAGE ROUTES IN SERVER SIDE FOR THE MESSAGE CONTROLLER
                                                ***********************************************************************
                                                ***********************************************************************
=============================================================================================================================================================*/
/*********************************************************************************************************
                    FUNCTION TO POST THE MESSAGE 
************************************************************************************************************/ 
//for posting the message
module.exports.postMessage = function(req,res){
  var receiverImage="";
  var receiverUsername="";
  User.findById(req.body.receiverUserId,function(err,allData){
               if(err){
                res.json(err);
               }else{
             
                receiverImage=allData.image;
                receiverUsername=allData.username;
                var message= new Message(); 
  message.receiverId= req.body.receiverUserId;
  message.senderId = req.body.senderUserId;
  message.message= req.body.message;
  message.senderImage=req.body.image;
  message.senderUsername=req.body.username;
  message.receiverUsername=receiverUsername;
  message.receiverImage=receiverImage;
  message.counter=req.body.counter+1;
  message.save();
  res.json("yes");
               }
  })


}

/************************************* END OF THE POST MESSAGE ****************************************************/
/*********************************************************************************************************
                    FUNCTION TO POST THE MESSAGE 
************************************************************************************************************/ 
//for posting the message
apiRouter.post('/message/postMessage', function(req,res){
  var receiverImage="";
  var receiverUsername="";
  User.findById(req.body.receiverId,function(err,allData){
               if(err){
                res.json(err);
               }else{
             
                receiverImage=allData.image;
                receiverUsername=allData.username;

                var message= new Message(); 
  message.receiverId= req.body.receiverId;
  message.senderId = req.body.senderId;
  message.message= req.body.message;
  message.senderImage=req.body.senderImage;
  message.senderUsername=req.body.senderName;
  message.receiverUsername=receiverUsername;
  message.receiverImage=receiverImage;
  message.counter=req.body.counter+1;
  message.save(function(err){
    if(err)
      res.json(err);
  });
  res.json({Message:"Message is sent"});
               }
  });
});


/************************************* END OF THE POST MESSAGE ****************************************************/
/********************************************************************************************************************************************************
             ROUTES TO GET THE MESSAGES FROM THE DATABASE
*********************************************************************************************************************************************************/
apiRouter.post('/message/getMessages',function(req,res){

  var userId=req.body.userId;
  Message.find({receiverId:userId})
  .sort({date:-1})
  .exec(function(err,allData){
    if(err){
      res.error(err);

    }

    else{
      res.json(allData);
      
    }
  });
});



/********************************************************************************************************************************************************
                 ROUTES TO POST A REPLY TO A MESSAGE
*********************************************************************************************************************************************************/
apiRouter.post('/reply/postReply',function(req,res){

  var messageId = req.body.messageId;
  var content = req.body.contents;
  var userId= req.body.userId;
  var userImage=req.body.userImage;
  var username=req.body.username;
  var counters= req.body.counters;
  
    Message.findById(messageId,function(err,allData){
                                 
              if(err){
                res.json(err);
              }else{
                allData.reply.push({replyerId:userId,contents:content,replyerImage:userImage,replyerUsername:username,receiverCounter:counters});
                allData.save();
                res.json(allData);
              }
            });


});

/********************************************************************************************************************************************************
                         ROUTES TO CALCULATE THE MESSAGE NOTIFICATION COUNTER
*********************************************************************************************************************************************************/
apiRouter.post("/main/messages",function(req,res){

  var userId=req.body.userId;
  var ReceivedTotal=0;
  var ReceivedReplyTotal=0;
  var SenderReplyTotal=0;
  Message.find({receiverId:userId},function(err,allData){
    if(err){
      res.json(err);
    }else{
      

      for(var i=0,len=allData.length;i<len;i++)
      {
                ReceivedTotal=allData[i].counter+ReceivedTotal;
                

                     for(var j=0,len1=allData[i].reply.length;j<len1;j++){
                     
                      if(userId!==allData[i].reply[j].replyerId)
                    ReceivedReplyTotal=ReceivedReplyTotal+allData[i].reply[j].receiverCounter;
                  

                }
      }
      
    }
  
  Message.find({senderId:userId},function(err,allData){
    if(err){
      res.json(err);
    }else{
      

      for(var i=0,len=allData.length;i<len;i++)
      {
                
                

                     for(var j=0,len1=allData[i].reply.length;j<len1;j++){
                     
                      if(userId!==allData[i].reply[j].replyerId)
                    SenderReplyTotal=SenderReplyTotal+allData[i].reply[j].receiverCounter;
                  

                }
      }
      
      res.json(SenderReplyTotal+ReceivedReplyTotal+ReceivedTotal);
    }
  })

});

});

/********************************************************************************************************************************************************
                        ROUTES TO UNSET THE MESSAGE COUNTER AS USE CLICKED
*********************************************************************************************************************************************************/
apiRouter.post('/main/unsetMessageNoti',function(req,res){

  var userId=req.body.userId;
  var message=req.body.message;
  Message.find({receiverId:userId},function(err,allData){
    if(err){
      res.json(err);
    }else{
      for(var i=0,len=allData.length;i<len;i++){
        if(allData[i].message===message)
        {
        allData[i].counter=0;
        allData[i].save();

        for(var j=0,len1=allData[i].reply.length;j<len1;j++){
          allData[i].reply[j].receiverCounter=0;
          allData[i].reply[j].save();
        }
      }/*end of if*/

      }
       
    }
  })
  Message.find({senderId:userId},function(err,allData){
    if(err){
      res.json(err);
    }else{
      for(var i=0,len=allData.length;i<len;i++){
        if(allData[i].message===message){
        allData[i].counter=0;
        allData[i].save();
        for(var j=0,len1=allData[i].reply.length;j<len1;j++){
          allData[i].reply[j].receiverCounter=0;
          allData[i].reply[j].save();
        }
      }/*end of if*/

      }
       
    }
  });

});

/********************************************************************************************************************************************************
                              ROUTES TO GET THE  NOTIFICATION FOR DIFFERENT MESSAGES
*********************************************************************************************************************************************************/
apiRouter.post('/main/getMessageNotification',function(req,res){

  userId=req.body.userId;
  var MessagesInfo=[{}];
  var allData1={};

  Message.find({receiverId:userId},function(err,allData){
    if(err){
      res.json(err);
    }else{
     for(var i=0,len=allData.length;i<len;i++){
     
      if(allData[i].counter===1){
          var allData1=allData[i];
        MessagesInfo.push({allData1,messageStatus:1});
      }

      for(var j=0,len1=allData[i].reply.length;j<len1;j++){
        if(allData[i].reply[j].receiverCounter===1){
          var allData2=allData[i].reply[j];
          MessagesInfo.push({allData2,messageStatus:2})
        }
      }
     }
    
      
 }

  })
  //THis is used to find the data on the senderId
  Message.find({senderId:userId},function(err,allData){
    if(err){
      res.json(err);
    }else{
      for(var i=0,len=allData.length;i<len;i++){
        for(var j=0,len1=allData[i].reply.length;j<len1;j++){
          if(allData[i].reply[j].receiverCounter===1){
          var allData3=allData[i].reply[j];
          MessagesInfo.push({allData3,messageStatus:3})
        }
        }
      }
      res.json(MessagesInfo);
    }
  });

});



/********************************************************************************************************************************************************
                            ROUTES TO GET THE SENT MESSAGES
*********************************************************************************************************************************************************/
apiRouter.post('/sentMessages/getsentMessages',function(req,res){

  var userId = req.body.userId;
  Message.find({senderId:userId})
  .sort({date:-1})
  .exec(function(err,allData){
    if(err){
      res.json(err);
    }else{
      
      res.json(allData);
    }
  });

});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx END OF THE MESSAGE ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/

/*=========================================================================================================================================================

                                                   BEGINNING OF THE CHAT ROUTES IN SERVER SIDE FOR 
                                                ***********************************************************************
                                                ***********************************************************************
=============================================================================================================================================================*/


/********************************************************************************************************************************************************
                            ROUTES TO GET THE GET CHAT USERS
*********************************************************************************************************************************************************/
apiRouter.post('/chat/getChatUser',function(req,res){

 Chat.find({},function(err,allData){
    
    if(err)
    {
      res.send(err);
    }
    else{
      console.log(allData);
      res.json(allData);
    }

 });

});


/********************************************************************************************************************************************************
                           RETURNING OF THE ROUTER
*********************************************************************************************************************************************************/

return apiRouter;


};
