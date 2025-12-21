const { executeCode } = require('./submissionControl');
const { generateFile } = require('../generateFile'); 
const Question = require('../models/Question');

const runSampleTests = async (req, res) => {
  // 📍 CHECKPOINT 1: Verify request hit the server
  console.log("🚀 [Backend] runSampleTests Hit!");
  const { problemId, code: userCode, language } = req.body;
  console.log(`📦 Received: ID=${problemId}, Lang=${language}`);

  try {
    // 📍 CHECKPOINT 2: Database Connection
    console.log("🔍 Finding problem in DB...");
    const problem = await Question.findById(problemId);
    
    if (!problem) {
        console.error("❌ Problem NOT found in DB");
        return res.status(404).json({ message: 'Problem not found' });
    }
    console.log("✅ Problem found:", problem.title);

    const template = problem.templates.find(t => t.language === language);
    if (!template) {
        console.error("❌ Template missing");
        return res.status(400).json({ message: 'Language template not found' });
    }

    const fullCode = template.code.replace(/(?:\/\/|\#) USER_CODE_HERE/, userCode);
    const samples = problem.testCases ? problem.testCases.slice(0, 3) : [];
    
    if (samples.length === 0) console.warn("⚠️ No test cases found!");

    let results = [];
    
    // 📍 CHECKPOINT 3: File Generation
    console.log("📂 Generating code file...");
    const filePath = await generateFile(language, fullCode);
    console.log(`✅ Code file created at: ${filePath}`);

    for (const [i, testCase] of samples.entries()) {
      console.log(`▶️ Running Test Case ${i + 1}...`);
      
      const inputPath = await generateFile('txt', testCase.input);
      
      // 📍 CHECKPOINT 4: Execution
      // This is usually where it hangs if compilers are missing or loops are infinite
      console.log(`⚙️ Executing code with input: ${inputPath}`);
      
      const output = await executeCode(filePath, inputPath, language);
      
      console.log(`✅ Output received: ${output}`); // Log the raw output

      const cleanOutput = output ? output.trim() : "";
      const cleanExpected = testCase.expectedOutput ? testCase.expectedOutput.trim() : "";

      results.push({
        input: testCase.input,
        expected: cleanExpected,
        got: cleanOutput,
        passed: cleanOutput === cleanExpected
      });
    }

    console.log("📤 Sending results back to frontend...");
    res.json({ results });

  } catch (error) {
    console.error("🔥 FATAL ERROR in runSampleTests:", error);
    res.status(500).json({ 
        message: 'Error executing code', 
        output: error.toString() 
    });
  }
};

module.exports = { runSampleTests };