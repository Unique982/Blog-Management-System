const mongoose = require('mongoose');
 const categorySchema = mongoose.Schema({
  categoryName:{
    type:String,
    required:[true,"Category is required"]
  },
  description:{
    type:String,
    required:[true,"Description is required"]
  },
 },
 {Timestamps:true},

);
 module.exports = mongoose.model("Category",categorySchema);