
import { Router } from "express";
import { runCode } from "../controllers/compiler.controller";
import {
  protect,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

router.use(protect, authorize("user"));

router.post("/run", runCode);

export default router;
