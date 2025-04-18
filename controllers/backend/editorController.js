const {check, validationResult } = require('express-validator');
const User = require('../../models/user');
const bcrypt = require("bcryptjs");
// user
exports.getEditorlist = async(req,res,next) =>{
  const users =await User.find({userType:'editor'}).sort({_id:-1});
  res.render('admin/editor/list',{pageTitle:'editor View page',
    users: users.map((users,index)=>({...users.toObject(),sn:index+1})),  
    user:req.user,
    userType:req.user?.userType,
});
}
// get Editor add From 
exports.getAddEditorFrom = (req,res,next) =>{
  res.render("admin/editor/add",{pageTitle:"Signup Page"
    ,isLoggedIn:false,user:{}, errors:{}, oldInput:{},
    user:req.user,
    userType:req.user?.userType,
})
}
// post Editor add Form handling 
exports.postEditorFrom = [
  check("username")
  .notEmpty()
  .withMessage("Username is required")
  .trim()
  .isLength({min:3})
  .withMessage("Username must be at 3 Characters long")
  .matches(/^[A-Za-z0-9\s]+$/)
  .withMessage("Username should  letter and number")
  ,
  check("firstName")
  .notEmpty()
  .withMessage("Firstname is required")
  .trim()
  .isLength({min:3})
  .withMessage("Firstname must be at 3 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Firstname should  only letter")
  ,
  check("lastName")
  .notEmpty()
  .withMessage("Lastname is required")
  .trim()
  .isLength({min:3})
  .withMessage("Lastname must be at 3 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Lastname should only letter")
  ,
  check("email")
  .notEmpty()
  .withMessage("Email is required")
  .trim()
  .isEmail()
  .withMessage("Please enter valid email")
  ,
  check("password")
  .notEmpty()
  .withMessage("Password is required")
  .trim()
  .isLength({min:8})
  .withMessage("Password must be at 8 characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .withMessage("Password must contain lowecase, uppercase and number")
  ,
   (req,res,next) =>{
    const {username,firstName,lastName,email,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render('admin/editor/add',{
        pageTitle:"Editor Add",
        errorMessage:errors.array().map(errors=> errors.msg),
        errors:errors.mapped(),
        oldInput:{
          username,firstName,lastName,email,password
        },
        user:{},
        user:req.user,
        userType:req.user?.userType,
      })
    }
    bcrypt.hash(password,12).then(hashedPassword =>{
      const user = new User({username,firstName,lastName,email,password:hashedPassword,userType:'editor'});
      console.log(user);
      return user.save();
    }).then(() =>{
      console.log("Editor Account Successfully");
      res.redirect('/admin/editor/list');
    }).catch(err =>{
      return res.status(422).render('admin/editor/add',{
        pageTitle:"Editor Page",
        errorMessage:[err.message],
        oldInput:{
          username,firstName,lastName,email
        },
        user:req.user,
        userType:req.user?.userType,
      })
    })
}]
// delete Editor handling
exports.deleteEditor = (req,res,next) =>{
  const id = req.params.id;
  User.findByIdAndDelete(id).then(()=>{
    console.log("Delete Successfully");
    res.redirect('/admin/editor/list');
  }).catch(err =>{
    console.log("Deleting Error",err);
  });
}

// editor get Edit form 
exports.getEditorEditForm = (req,res,next) =>{
  const id = req.params.id;
  User.findById(id).then(editorInfo =>{
    if(!editorInfo){
      console.log("Editor is not found");
     return res.redirect('/admin/editor/list');
    }
    res.render('admin/editor/edit',{
      pageTitle:"Update Editor",
      editorInfo:editorInfo,errors:{},
      user:req.user,
      userType:req.user?.userType,
    });
  }).catch(err =>{
    console.log("Delete Error",err);
    res.redirect('/admin/editor/list');
  });
}

// editor edit Post Form Handling

exports.postEditorEditForm =[
  check("username")
  .notEmpty()
  .withMessage("Username is required")
  .trim()
  .isLength({min:3})
  .withMessage("Username must be at 3 Characters long")
  .matches(/^[A-Za-z0-9\s]+$/)
  .withMessage("Username should  letter and number")
  ,
  check("firstName")
  .notEmpty()
  .withMessage("Firstname is required")
  .trim()
  .isLength({min:3})
  .withMessage("Firstname must be at 3 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Firstname should  only letter")
  ,
  check("lastName")
  .notEmpty()
  .withMessage("Lastname is required")
  .trim()
  .isLength({min:3})
  .withMessage("Lastname must be at 3 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Lastname should only letter")
  ,
  check("email")
  .notEmpty()
  .withMessage("Email is required")
  .trim()
  .isEmail()
  .withMessage("Please enter valid email")
  ,

   (req,res,next) =>{
    const {id,username,firstName,lastName,email} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render('admin/editor/edit',{
        pageTitle:"Update Editor",
        errorMessage:errors.array().map(
          errors=>errors.msg
        ),
        errors:errors.mapped(),
       user:{_id:id,username,firstName,lastName,email},
       user:req.user,
       userType:req.user?.userType,
      })
    }
    User.findById(id).then((editorInfo =>{
      editorInfo.username=username;
      editorInfo.firstName =firstName;
      editorInfo.lastName = lastName;
      editorInfo.email = email;
      editorInfo.save().then((result)=>{
        console.log("Edit Successfully",result);
        res.redirect('/admin/editor/list');
      }).catch(err =>{
        console.log("Edit Error",err);
        res.redirect('/admin/editor/edit');
      });

    }));//
}
]
 