const express = require('express');
const bodyParser = require("body-parser");
// const dotev = require('dotenv').config();
const session = require("express-session");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);

const { default: mongoose } = require('mongoose');

// define all router here
// backend Router
const dashbaordRouter = require('./routes/dashboard');
const categoryRouter = require('./routes/categoryRouter');
const editorRouter = require('./routes/editorRouter');
const postRouter = require('./routes/postRouter');

// login Page 
const authRouter = require("./routes/authRouter");

// Frontend router
const homeRouter = require('./routes/homeRouter');




const app = express();
app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
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
const PORT =  3000;

mongoose.connect(DB_URL).then(()=>{
  console.log("Connected To Mongoose");
  app.listen(PORT,()=>{
    console.log(`Server running an address :http://localhost:${PORT}`);
  })

}).catch(err =>{
  console.log("Conntection Error",err);
})