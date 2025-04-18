const User = require("../../models/user");

exports.getVisitorList = async (req,res,next) =>{
    const users = await User.find({userType:'user'}).sort({_id:-1});
    res.render('admin/visitor/list',{pageTitle:'Visitor Information',
      users: users.map((users,index)=>({...users.toObject(),sn:index+1}
    )),
    user:req.user,
    userType:req.user?.userType,
  });
  }