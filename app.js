var express=require('express');
var app=express();
const bodyParser=require('body-parser');
const path=require('path');
const ejsMate=require('ejs-mate');
var mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local');
var session=require('express-session');
const User=require('./models/user.js');
const flash=require('connect-flash');
var MongoStore=require('connect-mongo')(session);
mongoose.connect('mongodb://localhost:27017/shopping',{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true
});

const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
	console.log("database Connected");
})
const sessionConfig={
	secret:'No idea',
	resave:false,
	saveUninitialized:false,
	store:new MongoStore({mongooseConnection:mongoose.connection}),
	cookie:{maxAge:180*60*1000*8*2}
}

const PUBLISHABLE_KEY="pk_test_51Hx9nWEopJKnvNij5VLCQLQ5kXzT4f2Gu6BlTzvh4S0Oy1ZsvxKenmMsAYaDs9u4fGeiSS4rmcRXomJxZojprWQN00ZqBuajKT";
const SECRET_KEY="sk_test_51Hx9nWEopJKnvNijs6akgLbmAQaBKWOXNndgkmZU1fXYL7bhmxjx9fuEoNqWEvXYTd34ppD3NXTU5FpF5cvhqy5M001bmWMpHm";
const stripe=require('stripe')(SECRET_KEY);
app.use(bodyParser.urlencoded({extented:false}));
app.use(bodyParser.json());

const publicStaticDirPath=path.join(__dirname,'/public');
app.use(express.static(publicStaticDirPath));
const viewsPath=path.join(__dirname,'/views');
app.set('view engine','ejs');
app.set('views',viewsPath);
app.engine('ejs',ejsMate);
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true })); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
var indexroutes=require('./routes/index');
var userroutes=require('./routes/users');
app.use(function(req,res,next){
	res.locals.login=req.isAuthenticated();
	res.locals.user=req.user;
	res.locals.session=req.session;
	if(!req.session.cart){
	 res.locals.session.cart={};
    }
	next();
});
app.get('/home',function(req,res){
	res.render('homePage');
})
app.use('/user',userroutes);//user routes

app.use(indexroutes); ///index routes

app.use(function(req,res){ //eror page
	res.render('error');
})
//-----------------------------------------
app.listen(3000,function(){
	console.log("listening");
})