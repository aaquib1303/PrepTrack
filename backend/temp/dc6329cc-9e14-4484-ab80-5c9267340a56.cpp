#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
#include <stack>

using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size();
        if (n <= 2) return 0; // Cannot trap water with less than 3 bars

        int left = 0;
        int right = n - 1;
        
        int leftMax = 0;
        int rightMax = 0;
        
        int totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                // We are limited by the left side
                if (height[left] >= leftMax) {
                    // Update max height, no water trapped here
                    leftMax = height[left];
                } else {
                    // Current bar is shorter than leftMax, trap water
                    totalWater += leftMax - height[left];
                }
                left++;
            } else {
                // We are limited by the right side (or equal)
                if (height[right] >= rightMax) {
                    // Update max height
                    rightMax = height[right];
                } else {
                    // Current bar is shorter than rightMax, trap water
                    totalWater += rightMax - height[right];
                }
                right--;
            }
        }
        
        return totalWater;
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