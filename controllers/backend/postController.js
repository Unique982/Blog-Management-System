const {check,validationResult} = require('express-validator');
const Post = require('../../models/post');
const Category = require('../../models/category');
const User =require('../../models/user');
const post = require('../../models/post');

exports.getAddPost = async (req,res,next)=>{
 const categories = await Category.find();
//  console.log(categories); -> check categories print or not
    res.render('admin/post/add',{pageTitle:"Add Post Page",categories:categories,errors:{},oldInput:{}});
  
}
// handling post add 
exports.postAdd = [
  // Title Vlidation
  check("title")
  .notEmpty()
  .withMessage("Title is required")
  .isLength({min:3})
  .withMessage("Title must be at 3 characters long")
  .trim()
  .matches(/^[A-Za-z0-9\s]+$/)
  .withMessage("Title must contain only letter,number and space")
  ,
  // Descriptin Validation
  check("description")
  .notEmpty()
  .withMessage("Description is required")
  .trim()
  .isLength({min:30})
  .withMessage("Description must be min 30 characters")
  .matches(/^[a-zA-Z0-9\s.,!?()-]+$/)
  .withMessage("Description invalid characters")
  ,
  // Category Validation
  check("category")
  .notEmpty()
  .withMessage("Category is required")
  .trim()
  ,
async (req,res,next) =>{
  const {title,description,category,tag} = req.body;
  console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const categories = await Category.find();
    return res.status(422).render('admin/post/add',{
      pageTitle:"Add Post",
      errorsMessage:errors.array().map(
        errors => errors.msg),
        errors:errors.mapped(),
        post:{},
        categories:categories,
        oldInput:{title,description,category,tag},
    })
  }
  const author = req.session.user?._id;
  const post = new Post({title,description,category,tag,author})
  console.log(post);
  return post.save().then(() =>{
    console.log("Post added Successfully");
      res.redirect('/admin/post/list')
  }).catch(err =>{
    console.log("Inserted Error",err);
    return res.status(422).render('admin/category/list',{
      pageTitle:'Post Add',
      errorsMessage:[err.message],
      post:{},
      categories:[],
      oldInput:{title,description,category,tag}
     
    })
  })
},
];
// get all post list
exports.getPostList =async (req,res,next)=>{
  const post = await Post.find().populate('author','username').populate('category','categoryName')
  res.render('admin/post/list',{
    pageTitle:"Post List",
    PostList:post.map((post,index)=>({
      ...post.toObject(),sn:index+1,
      author:post.author?.username,
      categoryName:post.category?.categoryName,
      oldInput:{},
      formatedDate:new Date(post.createdAt).toLocaleDateString(),
      
    })
  )})
};

// delete Post 
exports.deletePost = (req,res,next)=>{
  const id = req.params.id;
  Post.findByIdAndDelete(id).then(()=>{
    console.log("Delete Successfully");
    res.redirect('/admin/post/list');
  }).catch(err => {
    console.log("Delete Error",err);
  });

}
// edit handling 
exports.editPost = async(req,res,next)=>{
  const categories =await Category.find();
  const postId = req.params.id;
  Post.findById(postId).then (postlist =>{
    if(!postlist){
      console.log("Post id not Found");
      return res.redirect('/admin/post/list');
    }
    console.log(postId,postlist);
    res.render("admin/post/edit",{
      pageTitle:"Edit Post",
      categories,
      category: postlist.category,
      postlist:postlist,errors:{},
    });
  }).catch(err =>{
    console.log("Edit Error",err);
    res.redirect('/admin/post/list');
  });
}

// post Edit form Handling
 exports.postEdit =[
  // Title Validation 
  check("title")
  .notEmpty()
  .withMessage("Title is required")
  .isLength({min:3})
  .withMessage("Title must be at 3 characters long")
  .trim()
  .matches(/^[A-Za-z0-9\s]+$/)
  .withMessage("Title must contain only letter,number and space")
  ,
  // Description validation
  check("description")
  .notEmpty()
  .withMessage("Description is required")
  .trim()
  .isLength({min:30})
  .withMessage("Description must be min 30 characters")
  .matches(/^[a-zA-Z0-9\s.,!?()-]+$/)
  .withMessage("Description invalid characters")
  ,
  // Category Validation 
  check("category")
  .notEmpty()
  .withMessage("Category is required")
  .trim()
  ,
  

   async(req,res,next) =>{
  const {id,title,description,category,tag} = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const categories = await Category.find();
    return res.status(422).render('admin/post/edit',{
      pageTitle:"Edit Page",
      errorsMessage:errors.array().map(errors =>errors.msg),
      errors:errors.mapped(),
      post:{_id:id,title,description,category,tag},
      categories:categories,
    })
  }
  Post.findById(id).then((post=>{
    post.title = title;
    post.description = description;
    post.category = category;
    post.tag = tag;
    post.save().then((result) =>{
      console.log("Update Successfully",result);
      res.redirect('/admin/post/list')
    }).catch(err =>{
      console.log("Error Edit",err);
      res.redirect('/admin/post/edit');
    });
  }))
 }
]

// View Page Display 
exports.viewPost = (req,res,next) =>{
  const postId = req.params.id;
  Post.findById(postId).populate('author','username').populate('category','categoryName').then(post=>{
    if(!post){
      console.log("Post id not found");
       return res.redirect('/admin/post/list');
    }
    res.render('admin/post/view',{
      pageTitle:"View Page",
      PostList:post,
        author:post.author?.username ||'',
        categoryName:post.category?.categoryName||'',
        oldInput:{},
        formatedDate:new Date(post.createdAt).toLocaleDateString(),
        
      })
   

  })

}