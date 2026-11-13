
import { Router } from "express";
import {
  submitSolution,
  getSubmissionHistory,
  getSubmissionById,
  getSubmissionsByProblem,
} from "../controllers/submission.controller";
import {
  protect,
  authorize,
} from "../middleware/auth.middleware";
import { submissionLimiter } from "../middleware/rateLimit.middleware";
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.use(protect, authorize("user"));

router.get("/history", getSubmissionHistory);
router.get("/problem/:slug", getSubmissionsByProblem);
router.get("/:id", getSubmissionById);

router.post(
  "/",
  submissionLimiter,
  [
    body("problemSlug").notEmpty().isString(),
    body("language")
      .isIn(["cpp", "python"])
      .withMessage("Unsupported language"),
    body("code")
      .notEmpty()
      .isString()
      .isLength({ max: 50000 })
      .withMessage("Code too long"),
  ],
  validate,
  submitSolution
);

export default router;
