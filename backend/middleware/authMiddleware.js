import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect=async(req,res,next)=>{
    let token;

     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
             // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      //verify token

      const decoded=jwt.verify(token,process.env.JWT_SECRET);

      //get user from token and attach to req
      req.user=await User.findById(decoded.id).select('-password');

      if(!req.user){
        return res.status(401).json({
            success:false,
            error:"user not found",
            statusCode:401
        })
      } 
       next()
        } catch (error) {
            console.error("Auth middleware error",error.message)
            
            if(error.name==='TokenExpiredError'){
                return res.status(401).json({
                    success:false,
                    error:"token has expired",
                    statusCode:401
                })
            }
            return res.status(401).json({
                success:false,
                error:"not authorized token failed",
                statusCode:401
            })
        }
     }

     if(!token){
        return res.status(401).json({
            success:false,
            error:"Not authorized, no token",
            statusCode:401
        })
     }

}
export default protect;