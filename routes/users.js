console.log("reached index");
var express=require('express');
var router=express.Router();
const cookieParser = require('cookie-parser'); 
var Product=require('../models/product');
const User=require('../models/user.js');
const Order=require('../models/order.js');
const passport=require('passport');
var oldpassword;
router.get('/signup',function(req,res){
 res.render('user/signup');
});
router.post('/signup',async function(req,res){
  try{
  const {email,username,password}=req.body;
  const user=new User({email,username,password});
  const registeredUser=await User.register(user,password);
  res.redirect('/');
  }catch(err){
    console.log(err.message);
    res.redirect('/user/signup');
  }
});
router.get('/signin',function(req,res){
 res.render('user/signin');
})
router.post('/signin',passport.authenticate('local',{failureFlash:true,failureRedirect:'/user/signin'}),function(req,res){
 res.redirect('/');
})
router.get('/passwordmanager',function(req,res){
  res.render('user/passwordmanager');
});
router.post('/passwordmanager',passport.authenticate('local',{failureFlash:true,failureRedirect:'/user/passwordmanager'}), function(req,res){
 oldpassword=req.body.password;
 res.redirect('/user/changepassword');
});
router.get('/changepassword',function(req,res){
 res.render('user/changepassword',{oldpassword});
});
router.post('/changepassword',async function(req,res){
 let p1=req.body.password1;
 let p2=req.body.password2;
 let id=req.user._id;
 if(p1===p2){
   let user= await User.findById(id);
   await user.changePassword(oldpassword,p1,function(err){
     return res.redirect('/user/passwordmanager');
   });
   return res.redirect('/');
 }
 res.redirect('/user/changepassword');
});
router.get('/orders',async function(req,res){
 let userId=String(req.user._id);
 let goods=await Order.find({user:userId});
 res.render('user/orders',{orders:goods});
});
router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})

//-------------------------------------
module.exports=router;
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/user/signin');
}