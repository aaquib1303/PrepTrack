const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { runSampleTests } = require("../controllers/runController");

router.post("/", protect, runSampleTests);

module.exports = router;