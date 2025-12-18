const execa = require("execa");      // ✅ Grabs the function directly (Correct)
const fs = require('fs/promises');
const path = require('path');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');

// This is our new, universal "worker"
const executeCode = async (filePath, inputPath, language) => {
  return new Promise(async (resolve, reject) => {
    try {
      let output;
      
      if (language === "cpp") {
        // 1. Define Output Path (executable)
        const jobId = require("path").basename(filePath).split(".")[0];
        const outPath = require("path").join(require("path").dirname(filePath), `${jobId}.out`);

        // 2. Compile
        // Use shell: true to handle permissions better in Docker
        await execa("g++", [filePath, "-o", outPath], { shell: true });

        // 3. Run
        // < inputPath feeds the input file into the program
        const { stdout } = await execa(outPath, [], { 
           inputFile: inputPath,
           shell: true 
        });
        output = stdout;

      } else if (language === "python") {
        const { stdout } = await execa("python3", [filePath], { 
           inputFile: inputPath,
           shell: true 
        });
        output = stdout;
      }
      
      resolve(output);

    } catch (error) {
      // 🛑 LOG THE REAL ERROR HERE
      console.error("EXECUTION ERROR DETAILS:", error);
      
      // Fallback if stderr is empty
      const errorMessage = error.stderr || error.message || "Unknown execution error";
      reject(`Compilation Error: ${errorMessage}`);
    }
  });
};

// This is our new "manager"
const submitCode = async (req, res) => {
  const { problemId, code: userCode, language } = req.body;
  const userId = req.user._id;

  try {
    const problem = await Question.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // 1. Find the correct template
    const template = problem.templates.find(t => t.language === language);
    if (!template) return res.status(400).json({ message: 'Language template not found' });

    // 2. Stitch the user's code into the template
const fullCode = template.code.replace(/(?:\/\/|\#) USER_CODE_HERE/, userCode);
    // 3. Loop through HIDDEN test cases
    let finalStatus = 'Accepted';
    let finalOutput = '';

    for (const testCase of problem.testCases) {
      const output = await executeCode(fullCode, testCase.input, language);

      if (output !== testCase.expectedOutput) {
        finalStatus = 'Wrong Answer';
        finalOutput = `Failed on input: ${testCase.input}\nExpected: ${testCase.expectedOutput}\nGot: ${output}`;
        break;
      }
    }

    // 4. Save submission
    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code: userCode, // Save only the user's code
      status: finalStatus,
    });

    // 5. Update user profile
    if (finalStatus === 'Accepted') {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { solvedProblems: problemId }
      });
      finalOutput = 'All test cases passed!';
    }

    res.status(201).json({ status: finalStatus, output: finalOutput, submission });
  } catch (error) {
    res.status(500).json({ message: 'Error during submission', output: error.message, status: 'Error' });
  }
};
const getProblemSubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;

    const submissions = await Submission.find({
      user: userId,
      problem: problemId
    })
    .sort({ createdAt: -1 }) // Newest first
    .select('status language createdAt code'); // Only get fields we need

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error: error.message });
  }
};

// Update exports
module.exports = { submitCode, executeCode, getProblemSubmissions };