import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/auth.controller";
import passport from "passport";
import { googleCallback } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  googleCallback
);
router.get("/me", protect, getMe);

export default router;