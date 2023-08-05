const mongoose = require('mongoose');

const PostSchema= new mongoose.Schema(
  {
    postId:{
      type:String,
      require:true,
    },
    message:{
      type:String,
      trim:true,
      maxlength:500,
    },
    picture:{
      type:String,
    },
    video:{
      type:String,
    },
    likers:{
      type:[String],
      require:true,
    },
    comments:{
      type:[
        {
          commenterId:String,
          commenterPseu:String,
          text:String,
          timestamp:Number,
        }
      ], 
      require:true,
    },
  },
  {
    timestamps:true,
  }
)

module.exports=mongoose.model('post',PostSchema);