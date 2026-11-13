
import { Router } from "express";
import {
  getAssignedStudents,
  getStudentProgress,
} from "../controllers/teacher.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// All routes require an authenticated teacher
router.use(protect, authorize("teacher"));

router.get("/students", getAssignedStudents);
router.get("/students/:id/progress", getStudentProgress);

export default router;
