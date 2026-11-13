
import { Router } from "express";
import {
  toggleBookmark,
  getMyBookmarks,
} from "../controllers/bookmark.controller";
import {
  protect,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

router.use(protect, authorize("user"));

router.get("/", getMyBookmarks);
router.post("/:slug/toggle", toggleBookmark);

export default router;
