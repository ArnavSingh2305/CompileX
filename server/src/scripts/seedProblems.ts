import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../models/Problem";

dotenv.config();

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hashing"],
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
    ],
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2", isHidden: false },
      { input: "2\n3 3\n6", expectedOutput: "0 1", isHidden: true },
    ],
  },
  {
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    topics: ["Strings"],
    description: "Write a function that reverses a string. The input string is given as a single line.",
    constraints: "1 <= s.length <= 10^5",
    examples: [{ input: "hello", output: "olleh" }],
    testCases: [
      { input: "hello", expectedOutput: "olleh", isHidden: false },
      { input: "CompileX", expectedOutput: "XelipmoC", isHidden: false },
      { input: "a", expectedOutput: "a", isHidden: true },
    ],
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    topics: ["Stack", "Strings"],
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid (every open bracket is closed by the same type in the correct order).",
    constraints: "1 <= s.length <= 10^4",
    examples: [{ input: "()[]{}", output: "true" }],
    testCases: [
      { input: "()", expectedOutput: "true", isHidden: false },
      { input: "()[]{}", expectedOutput: "true", isHidden: false },
      { input: "(]", expectedOutput: "false", isHidden: true },
    ],
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    topics: ["Binary Search", "Arrays"],
    description:
      "Given a sorted array of integers and a target value, return the index of target if found, else -1.",
    constraints: "1 <= nums.length <= 10^4\nnums is sorted in ascending order",
    examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
    testCases: [
      { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", isHidden: false },
      { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1", isHidden: false },
      { input: "1\n5\n5", expectedOutput: "0", isHidden: true },
    ],
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    topics: ["Arrays", "Dynamic Programming"],
    description:
      "Given an integer array, find the contiguous subarray with the largest sum and return that sum (Kadane's Algorithm).",
    constraints: "1 <= nums.length <= 10^5",
    examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6" }],
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: false },
      { input: "5\n5 4 -1 7 8", expectedOutput: "23", isHidden: true },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB for seeding");

    await Problem.deleteMany({});
    await Problem.insertMany(problems);

    console.log(`Seeded ${problems.length} problems successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();