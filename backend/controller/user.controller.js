import User from "../model/User.model.js";
import crypto from 'crypto'
import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const Vimal=async(req,res)=>{
    res.send("Vimal")
}

export const registerUser=async(req,res)=>{
  try {
    console.log(process.env.MAIL_TRAP_SENDEREMAIL)
      const {name,email,password}=req.body;
      if(!name||!email||!password)
      {
          return  res.status(400).json({
              message:"Please provide all the details"
          })
      }
      const existing_user= await User.findOne({email})
      if(existing_user){
          return res.status(400).json({
              message:"This user already exists"
          })
      }
     const user=await User.create({name,email,password})
     if(!user)
     {
      return res.status(400).json({
          message:"Failed to create a user"
      })
     }
     const token=crypto.randomBytes(32).toString("hex")
     user.verificationToken=token
     await user.save()
  
     //send email
  
     const transporter = nodemailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: process.env.MAIL_TRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user:process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    });
    const mailOption={
      from: process.env.MAIL_TRAP_SENDEREMAIL, // sender address
    to: user.email, // list of receivers
    subject: "Verify your email", // Subject line
    text: `Please click on the following link ${process.env.BASE_URL}/api/v1/verify/${token}`, // plain text body
    }
  
   transporter.sendMail(mailOption);
   res.status(200).json({
    message:"user created successfully",
    user:user,
    success:true
   })
  } catch (error) {
     return res.status(500).json({
        message:error.message,
     })
  }
}

export const verifyUser=async(req,res)=>{
    //get token 
  try {
      const {token}=req.params
      if(!token)
      {
        return res.status(400).json({message:"Please provide a valid message"})
      }
      const user=await User.findOne({verificationToken:token})
      if(!user)
      {
          return res.status(200).json({
      message:"Invalid Token"})
          }
      else{
       user.isVerified=true
       user.verificationToken=undefined
      }
      await user.save()
      res.status(200).json({
          message:"User verified successfully"
      })
  } catch (error) {
    res.status(400).json({
      message:error.message
    })
  }

}

export const login=async(req,res)=>{
  const {email,password}=req.body
  if(!email||!password)
    return res.status(400).json({
  message:"All fields are mandatory"})
try {
  
    const user=await User.findOne({email})
    if(!user)
      return res.status(400).json({
    message:"Please register"})

   const isMatch=  bcrypt.compare(password,user.password)
   if(!isMatch)
    return res.status(400).send({
  message:
    "please provide a correct password"
  })

//jwt 
const token=jwt.sign({
  id:user._id,
  role:user.role
},process.env.JWT_SECRET,{
  expiresIn:'24h'
})
const cookieOption={
  httpOnly:true,
  maxAge:24*1000*60*60
}
    res.cookie("token",token,cookieOption)
    res.status(200).json({
      success:true,
      message:"Login successfull",
      token,
      user:{
        id:user._id,
        role:user.role,
        name:user.name
      }
    })

} catch (error) {
  res.status(500).json({
    message:error.message
  })
}



}

export const getProfile=async(req,res)=>{
  //we have a token we can used that to extract
  try {

    let id=req.user?.id
    console.log(id);
    
    if(!id)
    {
      return res.status(400).json({
    message:"token doesnt have id"})
      }
    const user=await User.findById(req.user?.id).select('-password')
    if(!user)
    {
      return res.status(400).json({
    message:"failed to find the user"})
      }
 
    res.status(200).json({
      messsage:"User details succcessfully fetched",
      user
    })
  } catch (error) {
    return res.status(400).json({message:error.message})
  }
}

export const logout=async(req,res)=>{
  try {
    res.cookie("token","",{
      expires:new Date(0) //immediately delete cookies
    })
    res.status(200).json({
      message:"user loggedout successfully"
    })
  } catch (error) {
    res.status(400).json({
      message:error.message,
      success:true
    })
  }
}

export const forgotPassword=async(req,res)=>{
try {
  const {email}=req.body
  if(!email)
  {
    return res.status(400).json({
      message:"Email is required",
      success:false
    })
  }
  const user=await User.findOne({email})
  if(!user)
    return res.status(400).json({
  message:"please provide a valid email",
success:false})


const resetPasswordToken=crypto.randomBytes(32).toString("hex")
  user.resetPasswordToken=resetPasswordToken
  const resetPasswordExpires=Date.now()+10*60*1000
  user.resetPasswordExpires=resetPasswordExpires
  await user.save()

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: process.env.MAIL_TRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user:process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });
  const mailOption={
    from: process.env.MAIL_TRAP_SENDEREMAIL, // sender address
  to: user.email, // list of receivers
  subject: "Verify your email", // Subject line
  text: `Please click on the following link ${process.env.BASE_URL}/api/v1/resetPassword/${resetPasswordToken}`, // plain text body
  }

 transporter.sendMail(mailOption);
 res.status(200).json({
  message:"successfully sent email to the user",
  success:true,
  resetPasswordToken:resetPasswordToken,
 })
  
} catch (error) {
  return res.status(400).json({
    messsage:error.messsage,
  })
}
}

export const resetPassword=async(req,res)=>{
  try {
     const {resetPasswordToken}=req.params
     const {newPassword}=req.body
     if(!resetPasswordToken) return res.status(400).json({
      message:"please provide a valid token "
     })
     const user=await User.findOne({resetPasswordToken,
      resetPasswordExpires:{$gt:Date.now()}}) //10 minute expiry is set
     if(!user)
     {
      return res.status(400).json({
        message:"User not found"
      })
     }
     user.password=newPassword
     user.resetPasswordExpires=''
     user.resetPasswordToken=''
     await user.save()
     res.status(200).json({
      message:"Password successfully updated",
      suceess:true
     })
  } catch (error) {
    return res.status(400).json({
      message:error.messsage,
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { id } = req.user;

    // Build the update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, select: '-password' } // remove password from returned result
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};