#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
#include <stack>

using namespace std;

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