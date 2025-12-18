#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
#include <map>
#include <unordered_map>

using namespace std;

// User's code will be appended here by the backend logic
// But since we need the class definition BEFORE main, usually the backend puts User Code ABOVE this driver.
// If your backend puts Driver Code FIRST, you need to forward declare or restructure.
// Assuming Standard: User Code is pasted above Main.

int main() {
    string line;
    // Read nums array
    getline(cin, line);
    stringstream ss(line);
    int num;
    vector<int> nums;
    while (ss >> num) {
        nums.push_back(num);
    }

    // Read target
    int target;
    cin >> target;

    Solution sol;
    vector<int> result = sol.twoSum(nums, target);
    
    // Sort result to ensure consistent output like [0,1] vs [1,0]
    sort(result.begin(), result.end());
    
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}