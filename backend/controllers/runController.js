// Change runCode to executeCode
const { executeCode } = require('./submissionControl');
const Question = require('../models/Question');

const runSampleTests = async (req, res) => {
  const { problemId, code: userCode, language } = req.body;

  try {
    const problem = await Question.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // 1. Find the correct template
    // Note: If you updated your schema to use Array for templates, this works perfectly.
    // If you haven't, ensure this matches your DB structure.
    const template = problem.templates.find(t => t.language === language);
    if (!template) return res.status(400).json({ message: 'Language template not found' });

    // 2. Stitch the user's code into the template
    const fullCode = template.code.replace(/(?:\/\/|\#) USER_CODE_HERE/, userCode);

    // 3. ✅ FIX: Use 'testCases' instead of 'sampleTestCases'
    // We assume the first 2-3 test cases are the "public" samples
    const samples = problem.testCases ? problem.testCases.slice(0, 3) : [];

    if (samples.length === 0) {
        return res.status(400).json({ message: "No test cases found for this problem." });
    }

    let results = [];
    for (const testCase of samples) {
      // Execute the code with this input
      // Make sure executeCode accepts (code, input, language)
      const output = await executeCode(fullCode, testCase.input, language);
      
      // Clean up the output (trim newlines/spaces) for comparison
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
    console.error("Run Error:", error); // Log it so you can see it in terminal
    res.status(500).json({ message: 'Error executing code', output: error.message, status: 'Error' });
  }
};

module.exports = { runSampleTests };