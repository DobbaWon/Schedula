import { Request, Response } from "express";
import { authService } from "./auth.service";

class AuthController {
  handleOAuthRedirect(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Redirect to frontend dashboard, NOT backend
    const redirectUrl = authService.getRedirectUrl(req.user); // e.g., "/employee"
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    res.redirect(`${FRONTEND_URL}${redirectUrl}`);
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
