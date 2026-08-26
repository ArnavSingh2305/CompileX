import { Router } from "express";
import { submitSolution } from "../controllers/submission.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, submitSolution);

export default router;