
exports.getHome = (req,res,next) =>{
  const user = req.session.user;
  const userType = user?.userType;
  res.render('admin/dashboard',{pageTitle:"Blog Hub Admin Dashboard",isLoggedIn:req.isLoggedIn,user: req.session.user,userType:userType});
}