import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../models/Problem";
import { problemsData } from "../data/problems.data";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB for seeding");

    await Problem.deleteMany({});
    await Problem.insertMany(problemsData);

    console.log(`Seeded ${problemsData.length} problems successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();