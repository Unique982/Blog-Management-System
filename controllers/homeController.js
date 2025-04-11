exports.getHome = (req,res,next) =>{
  res.render("client/index",{pageTitle:"Home Page"})
}
