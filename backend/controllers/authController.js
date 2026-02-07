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
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide username, email, and password",
                statusCode: 400,
            });
        }
        
        // Check if user exists (email OR username)
        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error:
                    userExists.email === email
                        ? "Email already registered"
                        : "Username already taken",
                statusCode: 400,
            });
        }
        
        // Create user
        const user = await User.create({
            username,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user._id);
        
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt
                },
                token,
            },
            message: "User created successfully"
        });
    } catch (error) {
        next(error);
    }
};

//desc login a user
//routes post /api/auth/login
//acees pubic

export const login=async(req,res,next)=>{
 try {
        const {email,password}=req.body;


        //validate email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                error:"please provide email and password",
                statusCode:400
            })
        }

        //check for user (include password for comparison)
        const user=await User.findOne({email}).select('+password')
        

        if(!user){
            return res.status(401).json({
                success:false,
                error:"Invalid credentials",
                statusCode:401
            })
        }
        
        //check password
        const isMatch= await user.matchPassword(password)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                error:"Invalid credentials",
                statusCode:401
            })
        }
        
        //generate token
        const token=generateToken(user._id)
       return res.status(200).json({
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profileImage:user.profileImage,
        },
        token,
        message:"Login successfully"
       })
       
    } catch (error) {
        next(error)
    }
}

//desc get user profile
//routes get /api/auth/profile
//access private

export const getProfile=async(req,res,next)=>{
 try {
        const user=await User.findById(req.user._id)

        res.status(200).json({
            success:true,
            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt
            }

        })
    } catch (error) {
                next(error)

    }
}

//desc upadte user profile
//routes put /api/auth/profile
//access private

// controllers/authController.js

export const updateProfile = async (req, res, next) => {
    try {
        const { username, email, profileImage } = req.body;
        
        // 1. Find user by ID from the auth middleware (req.user._id)
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // 2. Check if username is taken by SOMEONE ELSE
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ 
                username: username.trim(), 
                _id: { $ne: req.user._id } 
            });
            if (usernameExists) {
                return res.status(400).json({ success: false, error: "Username already taken" });
            }
            user.username = username.trim();
        }

        // 3. Check if email is taken by SOMEONE ELSE
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ 
                email: email.trim(), 
                _id: { $ne: req.user._id } 
            });
            if (emailExists) {
                return res.status(400).json({ success: false, error: "Email already in use" });
            }
            user.email = email.trim();
        }

        if (profileImage) user.profileImage = profileImage;

        // 4. Save the user. 
        // NOTE: Your User.js model has: if(!this.isModified('password')) return;
        // This is crucial so your existing hashed password isn't re-hashed.
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            message: "Profile Updated Successfully"
        });

    } catch (error) {
        next(error);
    }
};

//desc change password
//routes get /api/auth/change-password
//access private 

export const changePassword=async(req,res,next)=>{
     try {
        const {currentPassword,newPassword}=req.body

        if(!currentPassword || !newPassword){
            return res.status(400).json({
                success:false,
                error:"please provide current and new passowrd correctly",
                statusCode:400
            })
        }

        const user=await User.findById(req.user._id).select("+password")

        //check current password
        const isMatch=await user.matchPassword(currentPassword)

        if(!isMatch){
            return res.status(401).json({
                success:false,
                error:"Current password is incorrect",
                statusCode:401
            })
        }

        //update password
        user.password=newPassword
        await user.save()

        res.status(200).json({
            success:true,
            message:"Password changed Successfuly"
        })
    } catch (error) {
        next(error)
    }
    
}