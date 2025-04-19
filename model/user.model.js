import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
const userschema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordexpiry:{
        type:Date
    },
    
 },
 {
    timestamps:true,
}
);

//pre hook 

userschema.pre("save",async function (next) {
    
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password ,10)
    }
    next()
})


const User = mongoose.model("User", userschema)



export default User
