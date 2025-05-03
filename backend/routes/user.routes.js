import { Vimal,registerUser,verifyUser,login,getProfile,logout,forgotPassword,resetPassword,updateUser} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import Router from 'express'

const router=Router()
router.get("/Vimal",Vimal)
router.post("/register",registerUser)
router.post("/verify_user/:token",verifyUser)
router.post("/login",login)
router.get("/me",isLoggedIn,getProfile)
router.post("/logout",isLoggedIn,logout)
router.post("/forgot-passowrd",forgotPassword)
router.post("/resetPassword/:resetPasswordToken",resetPassword)
router.put("/updateProfile",isLoggedIn,updateUser)
export default router;