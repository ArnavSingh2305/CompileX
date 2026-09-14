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
import { exchangeOAuthCode } from "../controllers/auth.controller";
import { authLimiter } from "../middleware/rateLimit.middleware";
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware";
import { changePassword } from "../controllers/auth.controller";

const router = Router();


router.get("/verify-email", verifyEmail);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

router.get(
  "/google",
  authLimiter,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  googleCallback
);
router.get("/me", protect, getMe);
router.post("/oauth/exchange", exchangeOAuthCode);
router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [body("email").isEmail().withMessage("Valid email required"), body("password").notEmpty()],
  validate,
  login
);
router.post("/change-password", protect, changePassword);
export default router;