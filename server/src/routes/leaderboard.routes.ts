import { Router } from "express";
import {
  getLeaderboard,
  getMyRank,
} from "../controllers/leaderboard.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getLeaderboard);
router.get("/me", protect, getMyRank);

export default router;