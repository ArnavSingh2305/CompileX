
import { Router } from "express";
import {
  getProblems,
  getProblemBySlug,
  runAgainstPublicTests,
  getAllTopics,
} from "../controllers/problem.controller";
import {
  protect,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

router.use(protect, authorize("user"));

router.get("/topics", getAllTopics);
router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);
router.post("/:slug/run", runAgainstPublicTests);

export default router;
