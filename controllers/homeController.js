 const Post = require('../models/post');
exports.getHome = async(req,res,next) =>{
  const posts = await Post.find().sort({createdAt:-1}).limit(5).populate('author','username').populate('category','categoryName');
  res.render("client/index",{pageTitle:"BlogHub Nepal", isLoggedIn:req.isLoggedIn,posts});
}