import { Router } from "express";
import { getProblems, getProblemBySlug } from "../controllers/problem.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getProblems);
router.get("/:slug", protect, getProblemBySlug);

export default router;