var mongoose=require('mongoose');
var Schema=mongoose.Schema;

const reviewSchema=new Schema({
	body:{type:String},
	rating:{type:Number},
	author:{type:String},
	authorId:{type:String}
})
module.exports=mongoose.model('Review',reviewSchema);