const { executeCode } = require('./submissionControl');
const { generateFile } = require('../generateFile'); // 👈 Import this!
const Question = require('../models/Question');

const runSampleTests = async (req, res) => {
  const { problemId, code: userCode, language } = req.body;

  try {
    const problem = await Question.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // 1. Find the correct template
    const template = problem.templates.find(t => t.language === language);
    if (!template) return res.status(400).json({ message: 'Language template not found' });

    // 2. Stitch the user's code into the template
    const fullCode = template.code.replace(/(?:\/\/|\#) USER_CODE_HERE/, userCode);
    
    // 3. Get Test Cases
    const samples = problem.testCases ? problem.testCases.slice(0, 3) : [];
    if (samples.length === 0) {
        return res.status(400).json({ message: "No test cases found." });
    }

    let results = [];
    
    // 4. ✅ Generate the Code File ONCE (it's the same for all test cases)
    const filePath = await generateFile(language, fullCode);

    for (const testCase of samples) {
      // 5. ✅ Generate a temp Input File for this specific test case
      const inputPath = await generateFile('txt', testCase.input);

      // 6. Execute using the FILE PATHS, not the code
      const output = await executeCode(filePath, inputPath, language);
      
      const cleanOutput = output ? output.trim() : "";
      const cleanExpected = testCase.expectedOutput ? testCase.expectedOutput.trim() : "";

      results.push({
        input: testCase.input,
        expected: cleanExpected,
        got: cleanOutput,
        passed: cleanOutput === cleanExpected
      });
    }

    res.json({ results });

  } catch (error) {
    console.error("Run Error:", error);
    // Send the actual error message back to the frontend
    res.status(500).json({ 
        message: 'Error executing code', 
        output: error.toString() // Use toString() to capture the full error message
    });
  }
};

module.exports = { runSampleTests };