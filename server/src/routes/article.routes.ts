import { Router } from "express";
import {
  getArticles,
  getArticleBySlug,
  getCategories,
  getArticlesByTopic,
} from "../controllers/article.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/categories", protect, getCategories);
router.get("/by-topic/:topic", protect, getArticlesByTopic);
router.get("/", protect, getArticles);
router.get("/:slug", protect, getArticleBySlug);

export default router;