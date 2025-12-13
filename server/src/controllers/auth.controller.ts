import { Request, Response } from "express";
import { authService } from "../services/auth.service";

class AuthController {
  handleOAuthRedirect(req: Request, res: Response) {
    // After successful OAuth login
    const redirectUrl = authService.getRedirectUrl(req.user);
    res.redirect(redirectUrl);
  }

  getCurrentUser(req: Request, res: Response) {
    if (req.isAuthenticated() && req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
}

export const authController = new AuthController();
