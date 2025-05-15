const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
 username:{
  type:String,
  required:[true,"Username is required"]
 },
 firstName:{
  type:String,
  required:[true,"FirstName is required"]
 },
 lastName:{
  type:String,
  required:[true,"LastName is required"]
 },
 email:{
  type:String,
  required:[true,"Email is required"],
  unique:true
 },
 userType:{
  type:String,
  enum:['admin','editor'],
  default:'user'
 },
 password:{
  type:String,
  required:[true,"Password is Required"]
 },
},
{timestamps:true}

);
module.exports = mongoose.model('User',userSchema);