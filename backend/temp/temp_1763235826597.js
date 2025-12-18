// This is the full code to paste into the editor

// Helper to read all input from stdin
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8');

// --- Your Solution Code Starts Here ---
try {
  // 1. Parse the input string
  const lines = input.trim().split('\n');
  const target = parseInt(lines[0]);
  const nums = JSON.parse(lines[1]);

  // 2. The actual "Two Sum" algorithm
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      
      // 3. Print the result to stdout in the exact expected format
      console.log(JSON.stringify([map.get(complement), i]));
      process.exit(0); // Exit successfully
    }
    map.set(nums[i], i);
  }

} catch (error) {
  // If anything goes wrong, print to stderr and exit
  console.error("Error in user code:", error.message);
  process.exit(1);
}
// --- Your Solution Code Ends Here ---