const Question = require("../models/Question");

const getAllProblems = async (req, res) => {
  try {
    const { search, difficulty } = req.query;

    let query = {};

    if (difficulty && difficulty !== "All") {
      // Using the case-insensitive regex we added
      query.difficulty = { $regex: new RegExp("^" + difficulty + "$", "i") };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 🚨 SPY LOGS: Add these 3 lines
    console.log("--- DEBUGGING SEARCH ---");
    console.log("1. Incoming Params:", { search, difficulty });
    console.log("2. MongoDB Query Object:", query);

    const questions = await Question.find(query)
      .select("-testCases -sampleTestCases -templates -functionStub");

    // 🚨 SPY LOG: Add this line
    console.log("3. Questions Found in DB:", questions.length);

    res.json(questions);
  } catch (error) {
    console.error("Search Error:", error); // Log the error if one happens
    res.status(500).json({ message: "Server Error" });
  }
};

const getProblemById = async (req, res) => {
 try {
        const question = await Question.findById(req.params.id).select("-testCases"); 
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Add other functions like createProblem if needed

const createQuestion = async (req, res) => {
  try {
    const { title, description, difficulty, tags, inputFormat, outputFormat, testCases, sampleTestCases, templates, functionStub, slug } = req.body;

    const question = new Question({
      title,
      description,
      difficulty,
      tags,
      inputFormat,
      outputFormat,
      testCases,
      sampleTestCases,
      templates,
      functionStub,
      slug
    });

    const createdQuestion = await question.save();
    res.status(201).json(createdQuestion);
  } catch (error) {
    res.status(400).json({ message: "Invalid question data", error: error.message });
  }
};

// @desc    Update a question
// @route   PUT /api/problems/:id
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (question) {
      question.title = req.body.title || question.title;
      question.description = req.body.description || question.description;
      question.difficulty = req.body.difficulty || question.difficulty;
      question.testCases = req.body.testCases || question.testCases;
      // ... update other fields as needed ...

      const updatedQuestion = await question.save();
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a question
// @route   DELETE /api/problems/:id
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (question) {
      await question.deleteOne();
      res.json({ message: "Question removed" });
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DON'T FORGET TO EXPORT THEM
module.exports = { 
  getAllProblems, getProblemById, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion 
};

