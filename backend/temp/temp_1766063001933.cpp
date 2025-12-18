#include <iostream>
#include <string>
#include <vector>
#include <cctype>
#include <algorithm>

using namespace std;

int main() {
    string s;
    getline(cin, s);

    Solution sol;
    bool result = sol.isPalindrome(s);

    cout << (result ? "true" : "false") << endl;
    return 0;
}