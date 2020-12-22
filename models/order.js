var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var schema=new Schema({
	user:{type:Schema.Types.ObjectId,ref:'User'},
	cart:{type:Object,required:true},
	date:{type:String,required:true}
});

const exp=mongoose.model('Order',schema);
module.exports=exp;