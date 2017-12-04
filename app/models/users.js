//now the model for the user is being listed down here and we can create the model for that

var mongoose = require('mongoose'); //this is used to create the mongoose model
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');//THis is the module to encrypt the user password


//User schema
var UserSchema = new Schema({
	email:{type:String,required:true,index:{unique:true}},
	username:String,
	password:{type:String,required:true,select:false},
	image:String,
	birthday:String,
	course:String,
	year:String,
	college:String,
	sex:String,
	bio:String,
	followers:[{userId:String,username:String,followersImage:String,counter:Number}],
	following:[{userId:String,username:String,followingImage:String}]
});

//hash the password before the user is saved


//.pre is a middleware which is used to act before any thing happen to UserSchema
UserSchema.pre('save',function(next){

    var user =this;

    //hash the password if only the password has been changed or new password
    if(!user.isModified('password'))
    	 return next();

    	//generate the encryption of the password
    	bcrypt.hash(user.password,null,null,function(err,hash){
    		if(err)
    			return next(err);

    		//change the password to the hashed version
    		user.password = hash;
    		next();

    	});


    	//function 
});


//Method to compare the password

UserSchema.methods.comparePassword = function(password){
	var user = this;

	return bcrypt.compareSync(password,user.password);


};


//return the model

module.exports = mongoose.model('User',UserSchema);