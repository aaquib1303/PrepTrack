const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth");
const {protect} = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/profile",protect,(req,res)=>{
    res.json({
        message:"Welcome to your profile",
        user:req.user
    })
})

module.exports=router;