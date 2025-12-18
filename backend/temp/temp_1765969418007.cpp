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