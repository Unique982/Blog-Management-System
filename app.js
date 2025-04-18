const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();
const session = require("express-session");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require('path');
const cookieParse = require('cookie-parser');

const checkForAuthenticationCokies = require('./middlewares/authentication');


const { default: mongoose } = require('mongoose');
const rootDir = require('./utils/pathUtils');

// define all router here
// backend Router
const dashbaordRouter = require('./routes/dashboard');
//Category Router
const categoryRouter = require('./routes/categoryRouter');
//editorRouter
const editorRouter = require('./routes/editorRouter');
//Post Router
const postRouter = require('./routes/postRouter');

// login Page 
const authRouter = require("./routes/authRouter");

//Visitor Controller
const visitorRouter = require("./routes/visitorRouter");

// Frontend router
const homeRouter = require('./routes/homeRouter');

// errors not found Page
const errorsController = require('./controllers/errors');


const DB_URL =process.env.DB_URL;

const app = express();
app.set('view engine','ejs');
app.set('views','views');
//Imagel Upload
const randomString = (length) =>{
  const characters = "abcdefghijklmnopqrstuvwxyz1234567890"
  let result = '';
  for(let i = 0;i<length;i++){
    result +=characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null,"Blog_img/");
  },
  filename:(req,file,cb)=>{
 cb(null,randomString(12)+'--'+file.originalname);
  
  }
})
 const fileFliter= (req,file,cb) =>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpeg' || file.mimetype==='jpg' || file.mimetype==='image/web'){
    cb(null,true);
  }
  else{
    cb(null,false);
}
};
const multerOption = {
  storage,fileFliter
}
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(multer(multerOption).single("blog_image"));
app.use(express.static(path.join((rootDir,'public'))));
app.use('/Blog_img', express.static(path.join(rootDir, 'Blog_img')));
app.use('/admin/Blog_img',express.static(path.join(rootDir,"Blog_img")));



// use route 
// app.use(dashbaordRouter);

const store = new MongoDBStore({
  uri:DB_URL,
  collection:"session"

});

// use Session
app.use(session({
  secret:"Create Session",
  resave:false,
  saveUninitialized:false,
  store
}));
app.use((req,res,next)=>{
req.isLoggedIn = req.session.isLoggedIn;
next();
});
app.use(cookieParse());
app.use(checkForAuthenticationCokies("token"));
app.use(homeRouter);
app.use(authRouter);


app.use("/admin",(req,res,next)=>{
  if(req.isLoggedIn){
    next()
  }
  else{
    res.redirect("/login");
  }
});
app.use("/admin",dashbaordRouter);
app.use("/admin",categoryRouter);
app.use("/admin",editorRouter);
app.use("/admin",postRouter);
app.use("/admin",visitorRouter);

// adding error page 
app.use(errorsController.pageNotFound);
const PORT =  3000;

mongoose.connect(DB_URL).then(()=>{
  console.log("Connected To Mongoose");
  app.listen(PORT,()=>{
    console.log(`Server running an address :http://localhost:${PORT}`);
  })

}).catch(err =>{
  console.log("Conntection Error",err);
})