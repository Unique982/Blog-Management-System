const {check, validationResult } = require('express-validator');
const User = require('../../models/user');
const bcrypt = require("bcryptjs");
// user
exports.getEditorlist = async(req,res,next) =>{
  const users =await User.find({userType:'editor'});
  res.render('admin/editor/list',{pageTitle:'editor View page',
    users: users.map((users,index)=>({...users.toObject(),sn:index+1}))
});
}
// get Editor add From 
exports.getAddEditorFrom = (req,res,next) =>{
  res.render("admin/editor/add",{pageTitle:"Signup Page"
    ,isLoggedIn:false,user:{}, errors:{}, oldInput:{}
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
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render('admin/editor/add',{
        pageTitle:"Editor Add",
        errorMessage:errors.array().map(errors=> errors.msg),
        errors:errors.mapped(),
        oldInput:{
          username,firstName,lastName,email,password
        },
        user:{}
      })
    }
    bcrypt.hash(password,12).then(hashedPassword =>{
      const user = new User({username,firstName,lastName,email,password:hashedPassword,userType:'editor'});
      console.log(user);
      return user.save();
    }).then(() =>{
      console.log("Editor Account Successfully");
      res.redirect('/admin/editor/add');
    }).catch(err =>{
      return res.status(422).render('admin/editor/add',{
        pageTitle:"Editor Page",
        errorMessage:[err.message],
        oldInput:{
          username,firstName,lastName,email
        }
      })
    })
}]

  
