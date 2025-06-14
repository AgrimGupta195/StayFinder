const jwt = require("jsonwebtoken");
const generateToken = (userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,   // it only open in http dont open through js prevent xss attacks cross-site scripting
        sameSite:"strict", // csrf attacks
        secure:process.env.NODE_ENV !=="development"
    });
    return token;
}

module.exports = generateToken;