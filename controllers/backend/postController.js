const {check,validationResult} = require('express-validator');
const Post = require('../../models/post');
const Category = require('../../models/category');
exports.getAddPost = async (req,res,next)=>{
 const categories = await Category.find()
//  console.log(categories); -> check categories print or not
    res.render('admin/post/add',{pageTitle:"Add Post Page",categories:categories});
  
}
exports.postAdd = [
  check("title")
  .notEmpty()
  .withMessage("Title is required")
  .isLength({min:3})
  .withMessage("Title must be at 3 characters long")
  .trim()
  .matches(/^[A-Za-z0-9\s]+$/)
  .withMessage("Title must contain only letter,number and space")
  ,
  check("description")
  .notEmpty()
  .withMessage("Description is required")
  .trim()
  .isLength({min:30})
  .withMessage("Description must be min 30 characters")
  .matches(/^[a-zA-Z0-9\s.,!?()-]+$/)
  .withMessage("Description invalid characters")
,
  check("category")
  .notEmpty()
  .withMessage("Category is required")
  .trim()
  ,

(req,res,next) =>{
  const {title,description,category,tag,author} = req.body;
  console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/post/add',{
      pageTitle:"Add Post",
      errorsMessage:errors.array().map(
        errors => errors.msg),
        errors:errors.mapped(),
        post:{}
    })
  }
  const post = new Post({title,description,category,tag,author})
  console.log(post);
  return post.save().then(() =>{
    console.log("Post added Successfully");
      res.redirect('admin/post/list')
  }).catch(err =>{
    console.log("Inserted Error",err);
    return res.status(422).render('admin/post/list',{
      pageTitle:'Post Add',
      errorsMessage:[err.message],
     
    })
  })


}
];