 const Post = require('../models/post');
// latest Post 
exports.latestPost = async(req,res,next) =>{
  const posts = await Post.find().sort({createdAt:-1}).limit(5).populate('author','username').populate('category','categoryName');
  res.render("client/index",{pageTitle:"BlogHub Nepal", isLoggedIn:req.isLoggedIn,latestPosts:posts});
}


exports.getHome = async(req,res,next) =>{
  const latestPosts=  await Post.find().sort({createdAt:-1}).limit(5).populate('author','username').populate('category','categoryName');
  // other post
  const allPosts = await Post.find().sort({createdAt:-1}).limit(20).populate('author','username').populate('category','categoryName');
// select lasted post id
  const latestId = latestPosts.map(post=>post._id.toString());

  const otherPosts = allPosts.filter(post=>!latestId.includes(post._id.toString()));
  res.render("client/index",{pageTitle:"BlogHub Nepal", isLoggedIn:req.isLoggedIn, latestPosts,otherPosts});
}

// Single post Displaty and 
exports.singlePost = async(req,res,next)=>{
  const id = req.params.id;
const post = await Post.findById(id).populate('author').populate('category','categoryName');
res.render("client/single",{pageTitle:post.title,post})
}