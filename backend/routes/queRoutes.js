const express = require("express");
const router = express.Router();
const { getAllProblems, getProblemById ,createQuestion, 
  updateQuestion, 
  deleteQuestion} = require("../controllers/questionController");
  const { protect, admin } = require("../middlewares/authMiddleware");

router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.post("/", protect, admin, createQuestion);
router.put("/:id", protect, admin, updateQuestion);
router.delete("/:id", protect, admin, deleteQuestion);

module.exports = router;