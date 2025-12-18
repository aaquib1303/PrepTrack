#include <iostream>
#include <string>
#include <vector>
#include <sstream>

// --- Helper Classes ---
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* buildList(const std::vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (size_t i = 1; i < arr.size(); ++i) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

void printList(ListNode* head) {
    std::cout << "[";
    ListNode* current = head;
    while (current) {
        std::cout << current->val;
        if (current->next) {
            std::cout << ",";
        }
        current = current->next;
    }
    std::cout << "]" << std::endl;
}

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

#PASTE THIS INTO THE "REVERSE LL" EDITOR
class Solution:
    def reverseList(self, head):
        prev = None
        curr = head
        while curr:
            nextTemp = curr.next
            curr.next = prev
            prev = curr
            curr = nextTemp
        return prev

// --- Judge's Main Function ---
int main() {
    try {
        std::string line;
        std::getline(std::cin, line);
        
        std::vector<int> nums = parseVector(line);
        ListNode* head = buildList(nums);
        
        Solution sol;
        ListNode* newHead = sol.reverseList(head);
        
        printList(newHead);
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}