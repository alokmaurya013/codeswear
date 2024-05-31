const mongoose=require('mongoose')
const ForGotSchema=new mongoose.Schema({
    userid:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    token:{type:String,required:true},

},{timestamp:true});
export default mongoose.models.User||mongoose.model("Forgot",ForGotSchema);