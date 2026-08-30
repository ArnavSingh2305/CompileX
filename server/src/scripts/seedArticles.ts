import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/Article";
import { articlesData } from "../data/articles.data";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB for seeding");

    await Article.deleteMany({});
    await Article.insertMany(articlesData);

    console.log(`Seeded ${articlesData.length} articles successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();