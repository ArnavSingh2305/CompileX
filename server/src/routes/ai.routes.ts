import { Router } from "express";
import {
  explainConcept,
  getHint,
  debugCode,
  explainComplexity,
} from "../controllers/ai.controller";
import { protect } from "../middleware/auth.middleware";
import { aiLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.use(protect, aiLimiter);

router.get("/explain/:slug", explainConcept);
router.post("/hint/:slug", getHint);
router.post("/debug/:slug", debugCode);
router.post("/complexity", explainComplexity);

export default router;