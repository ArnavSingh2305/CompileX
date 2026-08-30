import { Request, Response } from "express";
import Article from "../models/Article";
import Problem from "../models/Problem";

export const getArticles = async (req: Request, res: Response) => {
  try {
    const { category, topic, search } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (topic) filter.topic = topic;
    if (search) filter.title = { $regex: search as string, $options: "i" };

    const articles = await Article.find(filter).select("title slug category topic summary");
    res.status(200).json(articles);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const relatedProblems = await Problem.find({
      slug: { $in: article.relatedProblemSlugs },
    }).select("title slug difficulty");

    res.status(200).json({
      ...article.toObject(),
      relatedProblems,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Article.distinct("category");
    res.status(200).json(categories.sort());
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PHASE 16 reverse link: given a problem's topic, find related articles
export const getArticlesByTopic = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({ topic: req.params.topic }).select(
      "title slug summary"
    );
    res.status(200).json(articles);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};