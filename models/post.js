const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title:{
    type:String,
    required:[true,'Title is required'],
    min:[3,"Title must be at least 3 charaters"]
  },
  description:{
    type:String,
    required:[true,'Description is required'],
    min:[30,"Description  must be at least 30 charaters"]
  },
 
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:[true,'Catgory is required']
  },
  tag:{
    type:String
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
},
{timestamps:true},

);
 module.exports = mongoose.model('Post',postSchema);