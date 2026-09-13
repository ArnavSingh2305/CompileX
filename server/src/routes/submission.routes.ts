import { Router } from "express";
import {
  submitSolution,
  getSubmissionHistory,
  getSubmissionById,
  getSubmissionsByProblem,
} from "../controllers/submission.controller";
import { protect } from "../middleware/auth.middleware";
import { submissionLimiter } from "../middleware/rateLimit.middleware";
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.get("/history", protect, getSubmissionHistory);
router.get("/problem/:slug", protect, getSubmissionsByProblem);
router.get("/:id", protect, getSubmissionById);
router.post(
  "/",
  protect,
  submissionLimiter,
  [
    body("problemSlug").notEmpty().isString(),
    body("language").isIn(["cpp", "python"]).withMessage("Unsupported language"),
    body("code").notEmpty().isString().isLength({ max: 50000 }).withMessage("Code too long"),
  ],
  validate,
  submitSolution
);
export default router;