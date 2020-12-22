var express=require('express');
var router=express.Router();
const cookieParser = require('cookie-parser'); 
var Product=require('../models/product');
const User=require('../models/user.js');
const Review=require('../models/review.js');
const passport=require('passport');
const Order=require('../models/order.js');
var Cart=require('../models/cart.js');
const PUBLISHABLE_KEY="pk_test_51Hx9nWEopJKnvNij5VLCQLQ5kXzT4f2Gu6BlTzvh4S0Oy1ZsvxKenmMsAYaDs9u4fGeiSS4rmcRXomJxZojprWQN00ZqBuajKT";
const SECRET_KEY="sk_test_51Hx9nWEopJKnvNijs6akgLbmAQaBKWOXNndgkmZU1fXYL7bhmxjx9fuEoNqWEvXYTd34ppD3NXTU5FpF5cvhqy5M001bmWMpHm";
const stripe=require('stripe')(SECRET_KEY);
var cart;
var brnd=0;
var gnre=0;
//-----------------------------------------------
router.get('/',async function(req,res){
  console.log(req.user);
  brnd=0;
  gnre=0;
 let  pros=await Product.find();//list of items from database
 let quad=[];      //contains 4 items in a row
 let count=0;
 let prodarr=[];
 for(let i=0;i<pros.length;i++){
 if(count===4){
  count=0;
  let nrr=[];
  for(let x=0;x<quad.length;x++){
  	nrr.push(quad[x]);
  }
  prodarr.push(nrr);
  nrr=[];
  quad=[]; 
  }
  quad.push(pros[i]);
  count++;
 }
 if(quad.length!==0){
 	prodarr.push(quad);
 }
 let score=[];
 let total=0;
 let c=1;
 for(let i=0;i<prodarr.length;i++){
  for(let j=0;j<prodarr[i].length;j++){
    c=0;
    total=0;
   for(let r=0;r<prodarr[i][j].reviews.length;r++){
    c++;
    let rev=await Review.findById({_id:String(prodarr[i][j].reviews[r])});
    total=total+Number(rev.rating);
   }
   if(c!==0){
    total=total/c;
   }
   else{
    total=0;
   }
   score.push(total);
  }
 }
 res.render('shop/index',{title:'Express',products:prodarr,stars:score});
});

router.get('/add-to-cart/:id',function(req,res){ //add to cart   query=pg no
 let user=req.user;
 let productId=req.params.id;
 let val=req.query.pg;//holds the pg no
 if(req.session.cart[String(user._id)]){
   cart=new Cart(req.session.cart[String(user._id)]);
 }
 else{
  let obj={}
   cart=new Cart(obj);
 }
 Product.findById(productId,function(err,product){
  if(err){
    return res.redirect('/error'); 
  }
  cart.add(product,product.id);
  req.session.cart[String(user._id)]=cart;
  if(val==1){// redirect index page
    return res.redirect('/');
  }
  if(val==2){// redirect showpage
    return res.redirect(`/show?id=${req.query.id}`);
  }
  else{// redirect to filter page
   let brand=req.query.b;
   let genre=req.query.g;
   
   if(brand!=='0'&&genre!=='0'){
    
    return res.redirect(`/filter?brand=${brand}&genre=${genre}`);
  }
   if(brand!=='0'&&genre=='0'){

    return res.redirect(`/filter?brand=${brand}`);
 }
   if(brand=='0'&&genre!=='0'){
 
    return res.redirect(`/filter?genre=${genre}`);
  }
  }
 });
});

router.get('/shopping-cart',function(req,res,next){
 let user=req.user;
 if(!req.session.cart[String(user._id)]){
  return res.render('shop/shopping-cart',{products:null,totalPrice:0,key:PUBLISHABLE_KEY});
 }
 cart=new Cart(req.session.cart[String(user._id)]);
 res.render('shop/shopping-cart',{products:cart.generateArray(),totalPrice:(cart.totalPrice),key:PUBLISHABLE_KEY});
});

router.get('/reduce/:id',function(req,res,next){
 let user=req.user;
 var productId=req.params.id;
 var cart=new Cart(req.session.cart[String(user._id)]?req.session.cart[String(user._id)]:{});
 cart.reduceByOne(productId);
 req.session.cart[String(user._id)]=cart;
 res.redirect('/shopping-cart');
});

router.get('/remove/:id',function(req,res,next){
   let user=req.user;
 var productId=req.params.id;
 var cart=new Cart(req.session.cart[String(user._id)]?req.session.cart[String(user._id)]:{});
 cart.removeItem(productId);
 req.session.cart[String(user._id)]=cart;
 res.redirect('/shopping-cart');
});

router.get('/filter',async function(req,res,next){   //applying filters
 let b=req.query.brand;
 let g=req.query.genre;

 let pros;
 if(b&&!g){//only brand
  brnd=b;
  if(gnre!==0){
     pros=await Product.find({brand:brnd,genre:gnre});
  }
  else{
   pros=await Product.find({brand:brnd});
  }
 }

 else if(g&&!b){//only genre
  gnre=g;
  if(brnd!==0){
    pros=await Product.find({brand:brnd,genre:gnre});
  }
  else{
    pros=await Product.find({genre:gnre});
  }
 }

 else if(b&&g){ //redirected request from add-to-cart
  brnd=b;
  gnre=g;
  
  pros=await Product.find({brand:brnd,genre:gnre});
 }

 let quad=[];      
 let count=0;
 let prodarr=[];
 for(let i=0;i<pros.length;i++){
 if(count===4){
  count=0;
  let nrr=[];
  for(var x=0;x<quad.length;x++){
    nrr.push(quad[x]);
  }
  prodarr.push(nrr);
  nrr=[];
  quad=[]; 
  }
  quad.push(pros[i]);
  count++;
 }
 if(quad.length!==0){
  prodarr.push(quad);
 }

 let score=[];
 let total=0;
 let c=1;
 for(let i=0;i<prodarr.length;i++){
  for(let j=0;j<prodarr[i].length;j++){
    c=0;
    total=0;
   for(let r=0;r<prodarr[i][j].reviews.length;r++){
    c++;
    let rev=await Review.findById({_id:String(prodarr[i][j].reviews[r])});
    total=total+Number(rev.rating);
   }
   if(c!==0){
    total=total/c;
   }
   else{
    total=0;
   }
   score.push(total);
  }
 }
 res.render('shop/filter',{products:prodarr,brand:brnd,genre:gnre,stars:score});
});

router.get('/show',async function(req,res,next){     //showing Products uses query
  let iD=req.query.id;
  let prod=await Product.findById({_id:iD});
  let reviewId=prod.reviews;
  let revs=[];
  for(let i=0;i<reviewId.length;i++){
    let s=String(reviewId[i]);
    let o=await Review.findById({_id:s});
    revs.push(o);
  }
  //var st=await Review.find({}).body;
  //console.log(st);
  if(revs.length!==0){
    res.render('shop/show',{product:prod,reviews:revs});
  }
  else{
    res.render('shop/show',{product:prod,reviews:null});
  }
})

router.post('/product/:id/reviews',async function(req,res,next){ //updating reviews
  let prod= await Product.findById({_id:req.params.id});
  let review=new Review(req.body.review);
  prod.reviews.push(review);
  await review.save();
  await prod.save();
  res.redirect(`/show?id=${prod._id}`);
})

router.post('/product/delete/:id/reviews/:reviewId',async function(req,res,next){
  const iD=req.params.id;//product id
  const reviewID=req.params.reviewId;//review id
  await Product.findByIdAndUpdate(iD,{$pull:{reviews:reviewID}});
  await Review.findByIdAndDelete(reviewID);
  res.redirect(`/show?id=${iD}`);
})

router.post('/payment',function(req,res,next){
  stripe.customers.create({
    email:req.body.stripeEmail,
    source:req.body.stripeToken,
    name:'Debjyoti Chattopadhyay',
    address:{
      line1:"C-32,H.R.E.L,Haldia Township",
      postal_code:'721657',
      city:'Kolkata',
      state:'West Bengal',
      country:'India'
    }
  })
  .then(function(customer){
    return stripe.charges.create({
      amount:cart.totalPrice,
      description:'Web Developement Product',
      currency:'usd',
      customer:customer.id
    })
  })
  .then( async function(charge){
    var order=new Order({
      user:req.user,
      cart:cart,
      name:req.user.name,
      paymentId:charge.id
    })
    alert(paymentId);
    await order.save(function(err,result){
      res.redirect('/');
    })
    res.render('success');
  })
  .catch(async function(err){   
    let userId=req.user.id;
    let order;
    let d=new Date();
    let user;
    let cart;
    let date;
    user=await User.findById(userId);
    cart=req.session.cart[userId];
    date=`${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`;
    order=new Order({user,cart,date});
    await order.save();
    res.render('thankyou');
  });
});

//-----------------------------------------------
module.exports=router;