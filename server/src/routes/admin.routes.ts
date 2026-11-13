
import { Router } from "express";
import {
  getAllUsers,
  createTeacher,
  assignStudentToTeacher,
  updateUserStatus,
  getAdminStats,
} from "../controllers/admin.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// All admin routes require authentication and admin role.
router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.post("/teachers", createTeacher);
router.patch("/users/:id/teacher", assignStudentToTeacher);
router.patch("/users/:id/status", updateUserStatus);
router.get("/stats", getAdminStats);

export default router;
