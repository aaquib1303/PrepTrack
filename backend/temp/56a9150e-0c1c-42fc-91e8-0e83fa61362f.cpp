#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
#include <stack>

using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;

        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= leftMax)
                    leftMax = height[l];
                else
                    water += leftMax - height[l];
                l++;
            } else {
                if (height[r] >= rightMax)
                    rightMax = height[r];
                else
                    water += rightMax - height[r];
                r--;
            }
        }

        return water;
    }
};


int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    int num;
    vector<int> height;
    while (ss >> num) {
        height.push_back(num);
    }

    Solution sol;
    cout << sol.trap(height) << endl;
    return 0;
}