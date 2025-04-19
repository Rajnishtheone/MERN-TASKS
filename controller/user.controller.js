import User from "../model/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import  JsonWebToken  from "jsonwebtoken";

const registerUser = async (req, res) => {

    // res.send("registered")
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  console.log(email);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not Registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;

    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email ✔",
      text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req,res) =>{
    //get token from the url
    //validate the oken 
    //find user based on token 
    //if found set is verifies true
    //remove verification token
    //save
    //return response

    const {token} = req.params;
    console.log(token);
    if(!token){
        return res.status(400).json({
            message:"Invalid Token"
        })
    }
    const user = await User.findOne({verificationToken:token})
    
    if(!user){
        return res.status(400).json({
            message:"Invalid Token"
        })
    }
   

     user.isVerified = true;
     user.verificationToken = undefined;

     await user.save()



};


const login  = async (req,res)=>{
    const {email,password}= req.body
    if (!email || !password){
        return res.status(400).json
({
    message:"All field are required"
})    }

  try {
    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid Email or password"
        })
    }

     

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
     
    if(!isMatch){
        return res.status(400).json({
            message:"Invalid Email or password"
        })
    }
  
    const token = jwt.sign(
        {id:user._id, role: user.role},
    "shhhhh" , {
        expiresIn:'24h'
    }
);
const cookieOpions = {
    httpOnly:true,
    secure:true,
    maxAge:24*60*60*1000
}
res.cookie("token",token,cookieOpions)
 res.status(200).json({
    success:true,
    message:"Login Successfull",
    token,
    user:{
        id:user._id,
        name:user.name,
        role:user.role,
    },
 })


  } catch (error) {
    
  }
}

export { registerUser ,verifyUser };


