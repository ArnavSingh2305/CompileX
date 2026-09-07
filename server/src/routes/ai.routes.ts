import { Router } from "express";
import { explainConcept, getHint, debugCode, explainComplexity } from "../controllers/ai.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/explain/:slug", protect, explainConcept);
router.post("/hint/:slug", protect, getHint);
router.post("/debug/:slug", protect, debugCode);
router.post("/complexity", protect, explainComplexity);

export default router;