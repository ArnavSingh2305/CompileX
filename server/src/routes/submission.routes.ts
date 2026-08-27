import { Router } from "express";
import { submitSolution, getSubmissionHistory } from "../controllers/submission.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, submitSolution);
router.get("/history", protect, getSubmissionHistory);

export default router;