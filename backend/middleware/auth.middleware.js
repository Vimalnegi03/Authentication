import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const isLoggedIn=async(req,res,next)=>{
    //cookie mai se token lao
    //token check kro hai ya ni
    //fir decode kro data ko bas
    try {
        console.log(req.cookies);
        let token=req.cookies?.token||''
        if(!token){
            return res.status(400).json({
                message: "No token found",
                success:"Unauthorized"
            })
        }
      const decoded=jwt.verify(token,process.env.JWT_SECRET)
      console.log(decoded);
      //inside request i.e an object we created a key user and passed the payload inside that
      req.user=decoded
        
    } catch (error) {
        return res.status(400).json({
            message:error.message, 
            success:false
        })
    }
    next()
}