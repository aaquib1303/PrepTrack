const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const genToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});
}

const registerUser= async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message:"All fields are necessary"});
        }

        const exist=await User.findOne({email});
        if(exist) return res.status(400).json({message:"User already exists"});

        const salt = await bcrypt.genSalt(10); 
        const hashPass = await bcrypt.hash(password, salt);

        const newUser=await User.create({name,email,password:hashPass});

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email:newUser.email,
            token:genToken(newUser._id)
        })

    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}

const loginUser= async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password) {
            return res.status(400).json({message:"All fields are necessary"});
        }

        const exist=await User.findOne({email});
        if(!exist) return res.status(400).json({message:"Inavlid Credentials"});

        const match= await bcrypt.compare(password,exist.password);
        if(!match) return res.status(400).json({message:"Inavlid Credentials"});

        res.status(201).json({
            _id: exist._id,
            name: exist.name,
            email:exist.email,
            token:genToken(exist._id)
        })

    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}

module.exports={registerUser,loginUser};