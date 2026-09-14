import { Router } from "express";
import { getUserStats } from "../controllers/stats.controller";
import { protect } from "../middleware/auth.middleware";
import { getActivityHeatmap } from "../controllers/stats.controller";

const router = Router();

router.get("/", protect, getUserStats);
router.get("/activity", protect, getActivityHeatmap);
export default router;
