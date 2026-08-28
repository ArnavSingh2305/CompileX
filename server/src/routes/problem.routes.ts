import { Router } from "express";
import { getProblems, getProblemBySlug, runAgainstPublicTests } from "../controllers/problem.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getProblems);
router.get("/:slug", protect, getProblemBySlug);
router.post("/:slug/run", protect, runAgainstPublicTests);

export default router;