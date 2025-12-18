#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <unordered_map>

std::vector<int> parseVector(std::string str) {
    str.erase(0, 1);
    str.pop_back();
    std::vector<int> nums;
    if (str.empty()) return nums;
    std::stringstream ss(str);
    std::string num_str;
    while (std::getline(ss, num_str, ',')) {
        nums.push_back(std::stoi(num_str));
    }
    return nums;
}

#include <vector>
#include <unordered_map>

class Solution {
public:
    /**
     * Finds two indices such that the numbers at those indices add up to the target.
     * Time Complexity: O(n) - Single pass through the array.
     * Space Complexity: O(n) - To store the hash map of seen values.
     */
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Map to store: value -> index
        std::unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            
            // Check if the complement of the current number has been seen before
            if (seen.find(complement) != seen.end()) {
                // If found, return the index of the complement and current index
                return {seen[complement], i};
            }
            
            // Otherwise, store the current number and its index in the map
            seen[nums[i]] = i;
        }
        
        // Return empty vector if no solution is found (though the problem usually guarantees one)
        return {};
    }
};

int main() {
    try {
        std::string line1, line2;
        std::getline(std::cin, line1);
        std::getline(std::cin, line2);

        int target = std::stoi(line1);
        std::vector<int> nums = parseVector(line2);

        std::vector<int> result = twoSum(nums, target);
        std::cout << "[" << result[0] << "," << result[1] << "]" << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}