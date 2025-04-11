const {check, validationResult} = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// get Signup Form 
exports.getSignup = (req,res,next) =>{
  res.render("auth/signup",{pageTitle:"Signup Page"
    ,isLoggedIn:false,user:{}, errors:{}, oldInput:{}
  
  });
}
// post Signup Form data

exports.postSignup = [
  check("username")
  .notEmpty()
  .withMessage("Username is required")
  .trim()
  .isLength({min:3})
  .withMessage("Username must be at 3 Characters long")
  .matches(/^[A-Za-z0-9\s]+$/)
  .withMessage("Username should letter and number"),

  check("firstName")
  .notEmpty()
  .withMessage("Firstname is required")
  .trim()
  .isLength({min:3})
  .withMessage("FirstName must be at 3 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Firstname should only letter"),
  check("lastName")
  .notEmpty()
  .withMessage("Lastname is required")
  .trim()
  .isLength({min:3})
  .withMessage("LastName must be at 3 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Lastname should only letter"),
  check("email")
  .notEmpty()
  .withMessage("Email is required")
  .trim()
  .isEmail()
  .withMessage("Plase Enter Valid Email"),

  check("password")
  .notEmpty()
  .withMessage("Password is required")
  .trim()
  .isLength({min:8})
  .withMessage("Password Must be at 8 Characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .withMessage("Password must contain lowecase, uppercase and number"),
  check("confirmPassword")
  .notEmpty()
  .withMessage("Confirm password is required")
  .trim()
  .custom((value,{req})=>{
    if(value!== req.body.password){
      throw new Error("Password do not Match")
    }
    return true;
  }),

  // handle form request
  (req,res,next) =>{
    const {username,firstName,lastName,email,password,confirmPassword} = req.body;
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render('auth/signup',{
        pageTitle:'Signup Page',
        isLoggedIn:false,
        errorMessage:errors.array().map(
          errors =>errors.msg),
          errors:errors.mapped(),
          oldInput:{
            username,firstName,lastName,email,password,confirmPassword
          },
          user:{},
      })
    }
    
    bcrypt.hash(password,12).then(hashedPassword =>{
      const user = new User({username,firstName,lastName,email,password:hashedPassword});
      console.log(user);
      return user.save();
    
    }).then(()=>{
     console.log("User Account Create Successfully");
      res.redirect('/login');
      
    }).catch(err =>{
      return res.status(422).render('auth/signup',{
        pageTitle:'singup Page',
        isLoggedIn:false,
        errorMessage:[err.message],
        oldInput:{
          username,firstName,lastName,email
        }
      })
    })

  }]

// getLogin form
exports.getLogin = (req,res,next) =>{
  res.render("auth/login",{pageTitle:"Login Page",isLoggedIn:false,errorMessage:'',oldInput:{email:'',user:{}, },errors:{}});
}

// post Login 
exports.postLogin =async (req,res,next)=>{
  const {email,password} = req.body;
  const errors = validationResult(req);
  const user = await User.findOne({email});
  if(!user){
    return res.status(422).render("auth/login",{
      pageTitle:"login Page",
      isLoggedIn:false,
      errorMessage:'user dose not exits!',

      oldInput:{email},user:{},
    })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    return res.status(422).render('auth/login',{
      pageTitle:"Login Page",
      isLoggedIn:false,
      errorMessage:'Invalid User Account',
      oldInput:{email},user:{},
    })

  }
  req.session.isLoggedIn=true;
  req.session.user = user;
  await req.session.save();
  res.redirect('/admin/dashboard');

}

//logout section
exports.getLogout = (req,res,next) =>{
  req.session.destroy();
  res.redirect("/login");
}