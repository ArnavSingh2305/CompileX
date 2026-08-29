import { Router } from "express";
import { toggleBookmark, getMyBookmarks } from "../controllers/bookmark.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getMyBookmarks);
router.post("/:slug/toggle", protect, toggleBookmark);

export default router;