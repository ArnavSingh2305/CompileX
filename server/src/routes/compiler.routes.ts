import { Router } from "express";
import { runCode } from "../controllers/compiler.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/run", protect, runCode);

export default router;