const { validateToken } = require('../services/authenticationToken');
// check all for token 
function checkForAuthenticationCokies(cookieName){
  return (req,res,next) =>{
const tokenCookieValue = req.cookies[cookieName];
if(!tokenCookieValue){
  return next();

}
try{
const userPayload =  validateToken(tokenCookieValue);
req.user = userPayload;
return next();
}catch(err){
  console.log("Token validation errors",err);
}

  }
 };
 module.exports = checkForAuthenticationCokies;
