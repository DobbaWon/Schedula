import { Router } from "express";
import passport from "passport";
import { authController } from "./auth.controller";

const router = Router();

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.handleOAuthRedirect
);

// Microsoft OAuth
router.get("/microsoft", passport.authenticate("microsoft"));
router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/login" }),
  authController.handleOAuthRedirect
);

// Get current user
router.get("/user", authController.getCurrentUser);

export default router;
