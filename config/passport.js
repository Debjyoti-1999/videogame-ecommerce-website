var passport=require('passport');
var User=require('../models/user');
var LocalStrategy=require('passport-local').Strategy;
passport.serializeUser(function(user,done){
	done(null,user.id);
});
passport.deserializeUser(function(id,done){
	 User.findById(id,function(err,user){
	 	done(err,user);
	 });
});
passport.use('local.signup',LocalStrategy({
	 usernameField:'email',
	 passwordField:'password',
	 passReqToCallback:true
},function(req,email,password,done){
  User.findOne({'email':email},function(err,user){
   if(err){
   	return(err);
   }
   if(user){
   	return done(null,false,{message:'Email is Already in use'});
   }
   var newUser=new User();
   newuser.email=email;
   newUser.password=newUser.encryptPassword(password);
   newUser.save(function(err,result){
   	if(err){
   		done(err);
   	}
   	return(done(null,newUser));
   })
  });
}));