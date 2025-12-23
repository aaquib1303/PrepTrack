#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
#include <climits>

using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int currSum = nums[0];
        int maxSum  = nums[0];

        for (int i = 1; i < nums.size(); i++) {
            currSum = max(nums[i], currSum + nums[i]);
            maxSum = max(maxSum, currSum);
        }

        return maxSum;
    }
};


int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    int num;
    vector<int> nums;
    while (ss >> num) {
        nums.push_back(num);
    }

    if (nums.empty()) {
        cout << 0 << endl;
        return 0;
    }

    Solution sol;
    cout << sol.maxSubArray(nums) << endl;
    return 0;
}