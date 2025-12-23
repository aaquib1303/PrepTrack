const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8');

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map(); // value -> index

    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];

        if (map.has(need)) {
            return [map.get(need), i];
        }

        map.set(nums[i], i);
    }

    return [];
};

try {
  const lines = input.trim().split('\n');
  // Parse Line 1: "2 7 11 15" -> [2, 7, 11, 15]
  const nums = lines[0].trim().split(/\s+/).map(Number);
  const target = Number(lines[1]);

  const result = twoSum(nums, target);
  // Sort for consistent output comparison
  result.sort((a, b) => a - b);
  console.log(JSON.stringify(result));
} catch (e) {
  console.log("[]"); // Fail safe
}