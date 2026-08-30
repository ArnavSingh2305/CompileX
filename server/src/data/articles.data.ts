export const articlesData = [
  {
    title: "Two Pointers Technique",
    slug: "two-pointers",
    category: "DSA",
    topic: "Two Pointers",
    summary: "Learn how the two-pointer technique reduces many array and string problems from O(n²) to O(n).",
    content: `## What is Two Pointers?

The two-pointer technique uses two indices moving through a data structure — often an array or string — to avoid nested loops.

## Why does it work?

Many brute-force solutions check every pair of elements, costing O(n²) time. When the data is sorted or has a specific structure, two pointers let you eliminate large chunks of the search space in one pass.

## When should you use it?

- Finding pairs that sum to a target (in sorted arrays)
- Checking palindromes
- Merging two sorted arrays
- Removing duplicates in-place

## Basic example

Given a sorted array, find two numbers that sum to a target: start one pointer at the beginning, one at the end. If the sum is too large, move the right pointer left. If too small, move the left pointer right.

## Complexity

Time: O(n), Space: O(1) — a major improvement over the brute-force O(n²) pair-checking approach.

## Common mistakes

Forgetting the array must be sorted for the classic sum-finding pattern, or moving both pointers in the wrong direction when the sum doesn't match.`,
    codeExamples: [
      {
        language: "cpp",
        caption: "Two Sum on sorted array using two pointers",
        code: `#include <iostream>
using namespace std;

int main() {
    int n; cin >> n;
    int arr[n];
    for (int i = 0; i < n; i++) cin >> arr[i];
    int target; cin >> target;

    int left = 0, right = n - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            cout << left << " " << right;
            return 0;
        } else if (sum < target) left++;
        else right--;
    }
    return 0;
}`,
      },
    ],
    relatedProblemSlugs: ["two-sum", "merge-two-sorted-arrays", "palindrome-check"],
  },
  {
    title: "Sliding Window Technique",
    slug: "sliding-window",
    category: "DSA",
    topic: "Sliding Window",
    summary: "Master the sliding window pattern for substring and subarray problems.",
    content: `## What is Sliding Window?

A sliding window maintains a range (window) over part of an array or string, expanding or shrinking it based on a condition, instead of recomputing from scratch for every position.

## Why does it work?

Brute force often recalculates a sum or count for every possible window, costing O(n*k) or worse. Sliding window updates the window incrementally as it moves, achieving O(n).

## When should you use it?

- Maximum/minimum sum subarray of fixed size
- Longest substring without repeating characters
- Smallest subarray with a given sum

## Complexity

Time: O(n), Space: O(1) to O(k) depending on what you track inside the window.

## Common mistakes

Forgetting to shrink the window when a constraint is violated, or recomputing the whole window sum instead of adjusting incrementally.`,
    codeExamples: [
      {
        language: "cpp",
        caption: "Maximum sum subarray of size k",
        code: `#include <iostream>
using namespace std;

int main() {
    int n; cin >> n;
    int arr[n];
    for (int i = 0; i < n; i++) cin >> arr[i];
    int k; cin >> k;

    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;

    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }

    cout << maxSum;
    return 0;
}`,
      },
    ],
    relatedProblemSlugs: ["max-sum-subarray-size-k", "longest-substring-without-repeat"],
  },
  {
    title: "Dynamic Programming Basics",
    slug: "dp-basics",
    category: "DSA",
    topic: "Dynamic Programming",
    summary: "Understand memoization and tabulation, the two core approaches to dynamic programming.",
    content: `## What is Dynamic Programming?

DP solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation.

## Why does it work?

Naive recursion often recomputes the same subproblem many times (exponential time). DP caches these results — either top-down (memoization) or bottom-up (tabulation) — reducing time to polynomial.

## When should you use it?

Look for two signals: **optimal substructure** (the answer can be built from answers to smaller subproblems) and **overlapping subproblems** (the same subproblem recurs).

## Memoization vs Tabulation

Memoization: recursive, cache results in a map/array as you go.
Tabulation: iterative, build up a table from the base case forward.

## Complexity

Depends on the problem, but typically reduces exponential recursion to O(n) or O(n²).

## Common mistakes

Not identifying the correct state (what parameters define a subproblem), or forgetting base cases.`,
    codeExamples: [
      {
        language: "cpp",
        caption: "Climbing Stairs — tabulation",
        code: `#include <iostream>
using namespace std;

int main() {
    int n; cin >> n;
    if (n <= 2) { cout << n; return 0; }

    int dp[n + 1];
    dp[1] = 1; dp[2] = 2;
    for (int i = 3; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];

    cout << dp[n];
    return 0;
}`,
      },
    ],
    relatedProblemSlugs: ["climbing-stairs", "fibonacci-number", "house-robber", "coin-change"],
  },
  {
    title: "ACID Properties in DBMS",
    slug: "acid-properties",
    category: "DBMS",
    topic: "Transactions",
    summary: "The four properties every database transaction must guarantee: Atomicity, Consistency, Isolation, Durability.",
    content: `## What is ACID?

ACID is a set of properties that guarantee reliable database transactions.

## Atomicity

A transaction is all-or-nothing — either every operation in it succeeds, or none do. If a transfer debits one account but the credit fails, the whole transaction rolls back.

## Consistency

A transaction brings the database from one valid state to another, respecting all defined rules (constraints, triggers, cascades).

## Isolation

Concurrent transactions shouldn't interfere with each other — the result should be as if transactions ran one after another, even if they actually ran in parallel.

## Durability

Once a transaction commits, its changes persist even if the system crashes immediately after.

## Why it matters for interviews

ACID is one of the most commonly asked DBMS concepts in placement interviews — be ready to give a real-world example (like a bank transfer) for each property.`,
    codeExamples: [],
    relatedProblemSlugs: [],
  },
  {
    title: "Process vs Thread",
    slug: "process-vs-thread",
    category: "Operating Systems",
    topic: "Processes",
    summary: "The core distinction between processes and threads, and why it matters for system design interviews.",
    content: `## What is a Process?

A process is an independent program in execution, with its own memory space, file handles, and system resources.

## What is a Thread?

A thread is a lightweight unit of execution within a process. Multiple threads in the same process share memory space but have their own stack and register state.

## Key differences

- Processes don't share memory by default; threads do share the process's memory.
- Creating a process is more expensive (new memory space) than creating a thread.
- A crash in one thread can bring down the whole process; process isolation protects against this at a coarser level.

## Why it matters

Understanding this distinction underlies questions about concurrency, race conditions, and why certain bugs (like shared-memory corruption) only happen with threads, not separate processes.`,
    codeExamples: [],
    relatedProblemSlugs: [],
  },
];