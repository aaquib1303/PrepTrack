#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
#include <map>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;

        for (int i = 0; i < nums.size(); i++) {
            int need = target - nums[i];
            if (mp.count(need)) {
                return {mp[need], i};
            }
            mp[nums[i]] = i;
        }
        return {};
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
    
    int target;
    if (!(cin >> target)) return 0;

    Solution sol;
    vector<int> result = sol.twoSum(nums, target);
    
    sort(result.begin(), result.end());
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}