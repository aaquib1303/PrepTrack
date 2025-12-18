// This wrapper is needed to read all input from process.stdin
let input = '';
process.stdin.on('data', chunk => {
  input += chunk;
});

process.stdin.on('end', () => {
  // --- Your Solution Code Starts Here ---

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
      return;
    }
    map.set(nums[i], i);
  }

  // --- Your Solution Code Ends Here ---
});