const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: [
      {
        type: String,
      },
    ],
  slug: { type: String, required: true, unique: true },
  
  // Input/Output format descriptions (Optional but good)
  inputFormat: { type: String },
  outputFormat: { type: String },

  // Array of Test Cases
  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true } // ✅ Matches your error requirement
    }
  ],

  // Driver Code (Hidden) - Array for multi-language
  templates: [
    {
      language: { type: String, required: true },
      code: { type: String, required: true }
    }
  ],

  // User Starter Code (Visible) - Array for multi-language
  functionStub: [
    {
      language: { type: String, required: true },
      code: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Question", QuestionSchema);