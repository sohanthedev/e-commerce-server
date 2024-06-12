import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"
import JWT from "jsonwebtoken"
export const registerController =async(req,res)=>{
    try{
        const {name,email,password,phone,address,answer} = req.body
        if(!name){
            return res.send({message:'Name is required'})
        }
        if(!email){
            return res.send({ message:'email is required'})
        }
        if(!phone){
            return res.send({ message:'phone is required'})
        }
        if(!address){
            return res.send({ message:'address is required'})
        }
        if(!password){
            return res.send({ message:'password is required'})
        }
        if(!answer){
            return res.send({ message:'answer is required'})
        }
        // exisiting user
        const exisitingUser = await userModel.findOne({email})
        if(exisitingUser){
            return res.status(200).send({
                success:false,
                message:"User already exisit please login",
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer
        }).save()


        await user.save()
        res.status(201).send({
            success:true,
            message:"User created successfully",
            user
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in registration",
            error
        })
    }

}


// post Login
export const loginController =async(req,res)=>{
    try{
        const {email,password} = req.body
        //validation
        if(!email || !password){
            return res.status(404).send({ 
                success:false,
                message:"Invalid email or password"
              })
            }
            const user = await userModel.findOne({email})
            if(!user){
                return res.status(404).send({ 
                    success:false,
                    message:"email is not registered"
                  })
            }
            const match = await comparePassword(password,user.password)

            if(!match){
                return res.status(404).send({ 
                    success:false,
                    message:"Invalid email or password"
                  })
            }
            //token
      const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:"7d"
      })
    //   user.password = undefined
    //   user.secret = undefined
      res.status(200).send({
        success:true,
        message:"login successfully",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
        },token
      })
    }
    catch(error){
        console.log(error)  
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
}

// forgot password
export const forgotPasswordController =async(req,res)=>{
    try{
        const { email, answer,newPassword} = req.body

        if(!email){
            return res.status(400).send({ 
                message:"email is required"
              })
        }
        if(!answer){
            return res.status(400).send({ 
                message:"answer is required"
              })
        }
        if(!newPassword){
            return res.status(400).send({   
                message:"newPassword is required"
              })}

        const user = await userModel.findOne({email,answer})
        if(!user){
            return res.status(404).send({ 
                success:false,
                message:"wrong email or answer"
              })
        }
        const hashed = await hashPassword(newPassword)
       await userModel.findByIdAndUpdate(user._id,{password:hashed}) 
        res.status(200).send({
            success:true,
            message:"password reset successfully"
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in forgotPasswordController",
            error
        })
    }
}

export const testController =async(req,res)=>{
    res.send("Protected Routes")
}