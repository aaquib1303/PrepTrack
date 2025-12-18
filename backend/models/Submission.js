const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  code: { type: String }, 
  status: { type: String, enum: ["Accepted", "Wrong Answer"], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
