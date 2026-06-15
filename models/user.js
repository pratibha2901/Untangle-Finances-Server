import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   /*userId:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},*/
   email:{type:String,required:true,unique:true,trim:true,lowercase:true},
   passwordHash:{type:String,required:true,select:false},
   firstName:{type:String},
   lastName:{type:String},
   familyId :{type:mongoose.Schema.Types.ObjectId,ref:'Family'},
   participationType:{type:String,enum:['contributor','dependent'],default:'dependent'}, 
   familyRole:{type:String,enum:['owner','member'],default:'member'},
   income:{type:Number,required:true,default:0,min:0},
   
},{timestamps:true});
const User = mongoose.model('User',userSchema);
export default User;