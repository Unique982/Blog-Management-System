const User = require('../../models/user');
exports.getEditorlist = async(req,res,next) =>{
  const users =await User.find();
  res.render('admin/editor/list',{pageTitle:'editor View page',
    users: users.map((users,index)=>({...users.toObject(),sn:index+1}))
    
    
});
  
}