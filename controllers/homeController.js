exports.getHome = (req,res,next) =>{
  res.render("client/index",{pageTitle:"Mero Bloghub"})
}

exports.getHomeIndex = (req,res,next) =>{
  res.render("client/home",{pageTitle:"Second Home Page"});
}