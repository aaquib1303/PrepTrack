const express = require("express");
const router=express.Router();
const Submission = require("../models/Submission");
const {protect} = require("../middlewares/authMiddleware");
const { submitCode, getProblemSubmissions } = require("../controllers/submissionControl");

router.post("/", protect, submitCode);

router.get("/my", protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id }).populate("problem", "title difficulty");
    res.json(submissions);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:problemId", protect, getProblemSubmissions);

module.exports = router;
