import { User } from "../types/user";

class AuthService {
  getRedirectUrl(user: User | undefined) {
    // Implement role-based redirects if needed
    if (!user) return "/login";

    // Example: role-based dashboard
    switch (user.role) {
      case "admin":
        return "/admin";
      case "manager":
        return "/manager";
      default:
        return "/employee";
    }
  }
}

export const authService = new AuthService();
