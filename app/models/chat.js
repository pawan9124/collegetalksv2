var mongoose = require('mongoose');//get the schema of the mongoose
var Schema = mongoose.Schema;
var chatSchema = new Schema({
    username:String,
	userId:String,
	userImage:String,
	isActive:String
});

module.exports=mongoose.model('Chat',chatSchema);