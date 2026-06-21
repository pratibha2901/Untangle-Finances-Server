import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    //_id:{type:mongoose.Schema.Types.ObjectId,required:true,auto:true},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    tokenHash:{type:String,required:true,unique:true},
    isRevoked:{type:Boolean,default:false},
    deviceId: {type: String, required: true},
    deviceName:{type:String,required:true},
    expiresAt:{type: Date,required: true},
    lastUsedAt:{type: Date,default: Date.now},
    
},{timestamps:true}
);
refreshTokenSchema.index({userId: 1, isRevoked: 1});
refreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});
const RefreshToken = mongoose.model('RefreshToken',refreshTokenSchema);
export default RefreshToken;