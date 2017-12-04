
var mongoose = require('mongoose'); //this is used to create the mongoose model
var Schema = mongoose.Schema;


var postsSchema = new Schema({

	user:String,
  userId:String,
  userImage:String,
  content:String,
  like:String,
  userLike:[{likeUserId:String}],
  dislike:String,
  userDislike:[{dislikeUserId:String}],
  comment:[{userId:String,commentText:String,postImage:String,postName:String, date:{type:Date,default:Date.now}}],
  date:{type:Date,default:Date.now},
  isEditPost:{type:Boolean,default:false}

});

module.exports = mongoose.model('Posts',postsSchema);