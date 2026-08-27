import { Router } from "express";
import {
  submitSolution,
  getSubmissionHistory,
  getSubmissionById,
  getSubmissionsByProblem,
} from "../controllers/submission.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, submitSolution);
router.get("/history", protect, getSubmissionHistory);
router.get("/problem/:slug", protect, getSubmissionsByProblem);
router.get("/:id", protect, getSubmissionById);

export default router;