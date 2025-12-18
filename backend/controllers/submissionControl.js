const { execa } = require('execa');
const fs = require('fs/promises');
const path = require('path');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');

// This is our new, universal "worker"
const executeCode = async (code, input, language) => {
  console.log("--- FULL CODE TO BE EXECUTED ---", code);
  const tempDir = path.join(__dirname, '..', 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  let tempFile;
  let command, args, tempExe;

  // Set up the commands and file extensions
  switch (language) {
    case 'javascript':
      tempFile = path.join(tempDir, `temp_${Date.now()}.js`);
      command = 'node';
      args = [tempFile];
      break;
    case 'python':
      tempFile = path.join(tempDir, `temp_${Date.now()}.py`);
      command = 'python';
      args = [tempFile];
      break;
    case 'cpp':
      tempFile = path.join(tempDir, `temp_${Date.now()}.cpp`);
      tempExe = path.join(tempDir, `temp_${Date.now()}.exe`);
      await fs.writeFile(tempFile, code); // Write the .cpp file
      
      try {
        await execa('g++', [tempFile, '-o', tempExe]);
      } catch (compileError) {
        throw new Error(`Compilation Error: ${compileError.stderr}`);
      }
      
      command = tempExe;
      args = [];
      break; // C++ is special, we've already written the file
    default:
      throw new Error(`Language "${language}" is not supported.`);
  }

  // Write the file (for JS/Python)
  if (language !== 'cpp') {
    await fs.writeFile(tempFile, code);
  }

  // --- Execution Step ---
  try {
    const { stdout, stderr } = await execa(command, args, { input });
    if (stderr) throw new Error(`Runtime Error: ${stderr}`);
    return stdout.trim();
  } catch (execError) {
    throw new Error(`Runtime Error: ${execError.stderr || execError.message}`);
  } finally {
    // --- Cleanup Step ---
    if (tempFile) await fs.unlink(tempFile);
    if (tempExe) await fs.unlink(tempExe);
  }
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