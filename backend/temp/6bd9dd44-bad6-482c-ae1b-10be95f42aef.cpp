#include <iostream>
#include <string>
#include <vector>
#include <cctype>
#include <algorithm>

using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;

        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;

            if (tolower(s[l]) != tolower(s[r])) return false;

            l++;
            r--;
        }
        return true;
    }
};


int main() {
    string s;
    getline(cin, s);

    Solution sol;
    bool result = sol.isPalindrome(s);

    cout << (result ? "true" : "false") << endl;
    return 0;
}