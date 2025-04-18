const JWT = require('jsonwebtoken');

//gloabl Scret token 
const secret = "$#Unique@123";

function createTokenForUser(user){
  const payload ={
    _id: user._id,
    username:user.username,
    email:user.email,
    userType:user.userType,
  }
  const token = JWT.sign(payload,secret);
  return token;
}
function validateToken(token){
  const payload=JWT.verify(token,secret);
  return payload;
}
module.exports= {
  createTokenForUser,validateToken
};