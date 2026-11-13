
import { Router } from "express";
import {
  getUserStats,
  getActivityHeatmap,
} from "../controllers/stats.controller";
import {
  protect,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

router.use(protect, authorize("user"));

router.get("/", getUserStats);
router.get("/activity", getActivityHeatmap);

export default router;
