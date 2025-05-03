import { check,register,login,verifyUser,getUser,logoutUser,resetPassword,resetPasswordVerifcation,updateUser} from "../controllers/user.controller.js";
import Router from 'express';
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const router=Router();
router.get("/check",check)
router.post("/register",register)
router.post("/login",login)
router.post("/verify/:token",verifyUser)
router.get("/me",isLoggedIn,getUser)
router.post("/logout",logoutUser)
router.post("/resetPassword",resetPassword)
router.post("/resetPasswordVerify/:resetPasswordToken",resetPasswordVerifcation)
router.patch("/update",isLoggedIn,updateUser)
export default router;