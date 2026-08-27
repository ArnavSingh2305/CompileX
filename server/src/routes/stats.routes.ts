import { Router } from "express";
import { getUserStats } from "../controllers/stats.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getUserStats);

export default router;