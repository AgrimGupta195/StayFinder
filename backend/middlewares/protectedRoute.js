const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized-No token Provided"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized-No token Provided"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        
    }
}
const hostOnly = (req, res, next) => {
    if (req.user.role !== 'host') {
        return res.status(403).json({ message: "Forbidden: Host access only" });
    }
    next();
}
module.exports = {protectRoute, hostOnly};