const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth");
const { protect } = require("../middlewares/authMiddleware");
const Submission = require("../models/Submission"); // ✅ import the model
const { getLeaderboard } = require("../controllers/userController");
const { getUserProfile } = require("../controllers/auth");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

router.get("/leaderboard", getLeaderboard);

// Profile (basic POST check — can even remove this later)
router.post("/profile", protect, (req, res) => {
  res.json({
    message: "Welcome to your profile",
    user: req.user
  });
});

// Profile (GET with solved problems count)
router.get("/profile", protect, getUserProfile);

module.exports = router;
