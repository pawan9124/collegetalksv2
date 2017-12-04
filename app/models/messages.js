var mongoose = require('mongoose'); //this is used to create the mongoose model
var Schema = mongoose.Schema;

var messageSchema  = new Schema({

	receiverId:String,
	receiverImage:String,
	receiverUsername:String,
	senderId:String,
	senderImage:String,
	senderUsername:String,
	message:String,
	reply:[{replyerId:String,contents:String,replyerImage:String,replyerUsername:String,receiverCounter:Number,date:{type:Date,default:Date.now}}],
	counter:Number,
	 date:{type:Date,default:Date.now}
});


module.exports = mongoose.model('Message',messageSchema);