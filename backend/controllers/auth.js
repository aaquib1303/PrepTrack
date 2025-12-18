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
            isAdmin: exist.isAdmin, 
            token:genToken(exist._id)
        })

    } catch (error) {
  console.log("🔥 LOGIN CRASH:", error); // 👈 Add this line!
  res.status(500).json({ message: error.message });
}
}


// Get User Profile with Stats
const getUserProfile = async (req, res) => {
  try {
    // 1. Find the user and 'populate' the solvedProblems array
    // This replaces the IDs with the actual Question documents (title, difficulty, etc.)
    const user = await User.findById(req.user._id)
      .populate("solvedProblems", "title difficulty slug"); 

    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Calculate Stats
    const totalSolved = user.solvedProblems.length;
    
    const stats = {
      Easy: user.solvedProblems.filter(p => p.difficulty === "Easy").length,
      Medium: user.solvedProblems.filter(p => p.difficulty === "Medium").length,
      Hard: user.solvedProblems.filter(p => p.difficulty === "Hard").length
    };

    res.json({
      user: {
        name: user.name,
        email: user.email,
        solvedProblems: user.solvedProblems, // Send the full list
        stats: stats,
        isAdmin: user.isAdmin,
        totalSolved: totalSolved
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };