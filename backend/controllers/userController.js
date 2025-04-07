const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');

module.exports.registerUser = async (req,res) => {
    const {name,email,password} = req.body;
  try {
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    const userAllreadyExists = await userModel.findOne({email});
    if(userAllreadyExists){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }
    const user = await userModel.create({
        name,
        email,
        password,
    })
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET|| '12343dgd',{
        expiresIn:"30d"
    })
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            name:user.name,
            email:user.email,
            password:user.password,
        },
        token:token
    })
     await user.save();

  } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message,
    })
  }
}

module.exports.loginUser = async (req,res) => {
    const {email,password} = req.body;
  try {
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User does not exists"
        })
    }
    const isPasswordMatched  = await user.comparePassword(password);
    if(!isPasswordMatched){
        return res.status(400).json({
            success:false,
            message:"Invalid password"
        })
    }
  if(isPasswordMatched){
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET|| '12343dgd',{
        expiresIn:"30d"
    })
    res.status(200).json({
        success:true,
        message:"User login successfully",
        user:{
            name:user.name,
            email:user.email,
            password:user.password,
        },
        token:token
    })
  }
}
    catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
} 
