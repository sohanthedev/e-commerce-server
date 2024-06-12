import express from "express";
import {forgotPasswordController, loginController, registerController, testController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/middleware.js";
const router = express.Router();


router.post("/register",registerController)
// login
router.post("/login",loginController)


// forgot password
router.post('/forgot-password',forgotPasswordController)
// test router
router.get("/test",requireSignIn,isAdmin,testController)
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})
// admin route
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true}) 
})  

export default router