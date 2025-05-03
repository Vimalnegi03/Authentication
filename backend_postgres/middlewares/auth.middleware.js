import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const isLoggedIn=async(req,res,next)=>{
   try {
     console.log(req.cookies);
     if(!req.cookies.token)
     {
        return res.status(400).json({
            message:"Please login"
        })
     }
     if(req.cookies?.token)
     {
        const {token}=req.cookies
        console.log(token)
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded)
        req.user=decoded
     }
     
   } catch (error) {
     return res.status(400).send({
        message:error.message
     })
   }
   next()
}