import jwt from 'jsonwebtoken'
import User from "../models/User.js"

//generate a jwt

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES || "7d"
    })
}

//@desc register new user
//@route post /api/auth/regsiter
//access public

export const register=async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}

//desc login a user
//routes post /api/auth/login
//acees pubic

export const login=async(req,res,next)=>{

}

//desc get user profile
//routes get /api/auth/profile
//access private

export const getProfile=async(req,res,next)=>{

}

//desc upadte user profile
//routes put /api/auth/profile
//access private

export const updateProfile=async(req,res,next)=>{

}

//desc change password
//routes get /api/auth/change-password
//access private

export const changePassword=async(req,res,next)=>{
    
}