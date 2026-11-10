import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/Article";
import { articlesData } from "../data/articles.data";
import { additionalArticlesData } from "../data/articles.extra.data";

dotenv.config();

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for article upsert");

    const allArticles = [...articlesData, ...additionalArticlesData];
    const slugs = allArticles.map((article) => article.slug);
    if (new Set(slugs).size !== slugs.length) {
      throw new Error("Duplicate article slugs found in seed data");
    }

    // Upsert by slug. Never delete the existing article collection.
    const results = await Promise.all(
      allArticles.map((article) =>
        Article.updateOne({ slug: article.slug }, { $set: article }, { upsert: true })
      )
    );
    const inserted = results.filter((r) => r.upsertedCount > 0).length;
    const updated = results.filter((r) => r.modifiedCount > 0).length;
    console.log(`Article seed complete: ${inserted} inserted, ${updated} updated, ${allArticles.length} processed`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Article seeding failed:", error);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
  }
};

seed();
