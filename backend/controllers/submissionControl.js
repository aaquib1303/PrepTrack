const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');

// ✅ WORKER: Runs code using native OS shell (No 'execa' dependency needed)
const executeCode = (filePath, inputPath, language) => {
  return new Promise((resolve, reject) => {
    const jobId = path.basename(filePath).split('.')[0];
    
    // Windows requires .exe to execute binary files smoothly
    const isWindows = process.platform === 'win32';
    const outPath = path.join(path.dirname(filePath), `${jobId}${isWindows ? '.exe' : '.out'}`); 
    
    let command = '';

    // "Shell Trick": We use < to feed the input file into the program.
    // This bypasses Node.js stream handling and mimics a real terminal command.
    if (language === 'cpp') {
      command = `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`;
    } else if (language === 'python') {
      // Windows usually uses 'python', Linux uses 'python3'
      const pyCommand = isWindows ? 'python' : 'python3';
      command = `${pyCommand} "${filePath}" < "${inputPath}"`;
    } else if (language === 'javascript') {
        command = `node "${filePath}" < "${inputPath}"`;
    } else {
      return reject(`Unsupported language: ${language}`);
    }

    console.log(`[EXEC] Running: ${command}`);

    // Run with 4-second timeout to prevent infinite loops
    exec(command, { timeout: 4000 }, (error, stdout, stderr) => {
      
      // Cleanup: Delete the binary file after running
      if (fs.existsSync(outPath)) {
          try { fs.unlinkSync(outPath); } catch(e) {}
      }

      if (error) {
        // 1. Check for Timeout
        if (error.killed) {
            console.error(`[EXEC] Timeout hit`);
            return resolve("Time Limit Exceeded");
        }
        
        // 2. Check for Missing Compiler
        if (error.message.includes('not found') || error.message.includes('is not recognized')) {
            return resolve("Server Configuration Error: Compiler not found. (Install MinGW on Windows or check Dockerfile)");
        }
        
        // 3. Compilation/Runtime Errors
        console.error(`[EXEC] Error: ${stderr || error.message}`);
        return resolve(`Error: ${stderr || error.message}`);
      }

      // Success
      resolve(stdout);
    });
  });
};

// ✅ CONTROLLER: Handles the Request
const submitCode = async (req, res) => {
  const { problemId, code: userCode, language } = req.body;
  const userId = req.user._id;

  try {
    const problem = await Question.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const template = problem.templates.find(t => t.language === language);
    if (!template) return res.status(400).json({ message: 'Language template not found' });

    // 1. Prepare Code (Stitch user code into driver code)
    // Note: Ensure your backend/generateFile.js is imported in the file that calls this function 
    // OR we can just pass the raw strings to executeCode if we refactor, but keeping your structure:
    // We assume the caller (runController) handles file generation for the "Run" button.
    // This specific function handles the "Submit" button.
    
    // We need to generate the files HERE for the submit function:
    const { generateFile } = require('../generateFile'); // Lazy import to avoid circular dependency issues
    
    const fullCode = template.code.replace(/(?:\/\/|\#) USER_CODE_HERE/, userCode);
    const filePath = await generateFile(language, fullCode);

    let finalStatus = 'Accepted';
    let finalOutput = '';

    // 2. Run Test Cases
    for (const testCase of problem.testCases) {
      const inputPath = await generateFile('txt', testCase.input);

      const rawOutput = await executeCode(filePath, inputPath, language);
      
      const output = rawOutput ? rawOutput.trim() : "";
      const expected = testCase.expectedOutput ? testCase.expectedOutput.trim() : "";

      if (output !== expected) {
        finalStatus = 'Wrong Answer';
        finalOutput = `Failed on input: ${testCase.input}\nExpected: ${expected}\nGot: ${output}`;
        break; 
      }
    }

    // 3. Save Submission
    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code: userCode,
      language: language,
      status: finalStatus,
    });

    if (finalStatus === 'Accepted') {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { solvedProblems: problemId }
      });
      finalOutput = 'All test cases passed!';
    }

    res.status(201).json({ status: finalStatus, output: finalOutput, submission });

  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ message: 'Error during submission', output: error.message, status: 'Error' });
  }
};

const getProblemSubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;

    const submissions = await Submission.find({ user: userId, problem: problemId })
    .sort({ createdAt: -1 }) 
    .select('status language createdAt code'); 

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error: error.message });
  }
};

module.exports = { submitCode, executeCode, getProblemSubmissions };