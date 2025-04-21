exports.getHome = (req,res,next) =>{
  res.render("client/index",{pageTitle:"BlogHub Nepal", isLoggedIn:req.isLoggedIn});
}