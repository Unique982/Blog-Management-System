

const {check, validationResult } = require('express-validator');
const Category = require('../../models/category');
// category From Get
exports.getCategoryFrom = (req,res,next) =>{
  res.render('admin/category/add',{pageTitle:'Category page',isLoggedIn: req.session.isLoggedIn,user:req.session.user,userType:req.session.userType,errors:{}});
  
}
// From Handle category add 
exports.AddCategory =[
  check("categoryName")
  .notEmpty()
  .withMessage("Category is required")
  .trim()
  .isLength({min:3})
  .withMessage("Category must be at 3 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Category should only letter"),

  check("description")
  .notEmpty()
  .withMessage("Description is required")
  .trim()
  .isLength({min:10,max:500})
  .withMessage("Description must be between 10 and 500 characters")
  .matches(/^[a-zA-Z0-9\s.,!?()-]+$/)
  .withMessage("Description invalid characters"),


(req,res,next) =>{
  const {categoryName, description} = req.body;
  console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/category/add',{
      pageTitle:"Add Post",
      errorMessage:errors.array().map(
        errors =>errors.msg),
        errors:errors.mapped(),
      category:{}
    });
  }
  const category = new Category({categoryName,description});
  console.log(category);
  return category.save().then(()=>{
 console.log("Category Create Successfully");
 res.redirect('/admin/category/list')
  }).catch(err =>{
    console.log("error Insert",err);
    return res.status(422).render('admin/catgeory/list',{
      pageTitle:'Category Add',
      errorsMessage:[err.message],
    });
  })
  
}
];
// manage Category
exports.getCategoryDataList =async(req,res,next)=>{
  const categorys = await Category.find();
  res.render('admin/category/list',{pageTitle:"Manage Category",CategoryList:categorys.map((categorys,index)=>({
...categorys.toObject(),sn:index+1
  }))
});

}

// edit category form get
exports.getEditfrom = (req,res,next)=>{
  const categoryId = req.params.id;
  Category.findById(categoryId).then(categorys =>{
    if(!categoryId){
      console.log("Category id not Found");
      return res.redirect('/admin/category/list');
    }
console.log(categoryId,categorys);
  res.render("admin/category/edit",{pageTitle:"Edit Category",categorys:categorys,errors:{}});
}).catch(err =>{
  console.log("edit error",err);
  res.redirect('/admin/category/list')
})
}
// edit Post From
exports.postEditFromhandle =[
check("categoryName")
.notEmpty()
.withMessage("Category is required")
.trim()
.isLength({min:3})
.withMessage("Category must be at 3 characters long")
.matches(/^[A-Za-z\s]+$/)
.withMessage("Category should only letter"),

check("description")
.notEmpty()
.withMessage("Description is required")
.trim()
.isLength({min:10,max:500})
.withMessage("Content must be between 10 and 500 characters")
.matches(/^[a-zA-Z0-9\s.,!?()-]+$/)
.withMessage("Description invalid characters"),

(req,res,next) =>{
  const {id,categoryName,description} = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/category/edit',{
      pageTitle:"Update Category",
      errorMessage:errors.array().map(
        err =>err.msg),
        errors:errors.mapped(),
        categorys: { _id: id, categoryName,description }
    });
  }
  Category.findById(id).then((category)=>{
    category.categoryName = categoryName;
    category.description = description;
    category.save().then((result) =>{
      console.log("Update Successfully",result);
      res.redirect('/admin/category/list')
    }).catch(err =>{
      console.log("Error Update",err);
      res.redirect('/admin/category/edit');
    });
     

  })

}
]

// delete Category 
exports.deleteCategory = (req,res,next) =>{
  const id  =req.params.id;
  Category.findByIdAndDelete(id).then(()=>{
    console.log("delete Successfully");
    res.redirect('/admin/category/list');
  }).catch(err =>{
    console.log("Delete failed",err);
  });

}