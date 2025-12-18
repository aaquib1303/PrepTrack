#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
#include <climits>

using namespace std;

int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    int num;
    vector<int> nums;
    while (ss >> num) {
        nums.push_back(num);
    }

    Solution sol;
    cout << sol.maxSubArray(nums) << endl;
    return 0;
}