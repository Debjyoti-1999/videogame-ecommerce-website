var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var schema=new Schema({
	imagePath:{type:String,required:true},
	title:{type:String,required:true},
	price:{type:Number,required:true},
	brand:{type:String,required:true},
	genre:{type:String,required:true},
	windows:{type:String,required:true},
	mac:{type:String,required:true},
	chrome:{type:String,required:true},
	description:{type:String},
	reviews:[
     {
     	type:Schema.Types.ObjectId,
     	ref:'Review'
     }
	]
});
const exp=mongoose.model('Product',schema);
module.exports=exp;