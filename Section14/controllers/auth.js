const User = require("../models/user");



exports.getLogin=(req,res,next)=>{
    const isLoggedIn=req.get('Cookie').split(';')[1].trim().split('=')[1]
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:isLoggedIn
    });
}


exports.postLogin=(req,res,next)=>{
    
   
    User.findById('5bab316ce0a7c75f783cb8a8')
    .then(user => {
      res.session.isLoggedIn=true
      req.session.user = user;
      req.session.save((err)=>{
        console.log(err)
        res.redirect('/')
      })
      
    })
    .catch(err => console.log(err));
}

exports.postLogout=(req,res,next)=>{
  req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
  })

}