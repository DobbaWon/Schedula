import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

// Auth
import authRoutes from "./modules/auth/auth.routes";
import "./modules/auth/google.strategy";
import "./modules/auth/microsoft.strategy";
import { sessionConfig } from "./config/session";

// CRUD modules
import employeesRoutes from "./modules/employees/employees.routes";
import teamsRoutes from "./modules/teams/teams.routes";
import departmentsRoutes from "./modules/departments/departments.routes";
import organisationsRoutes from "./modules/organisations/organisations.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import leaveRoutes from "./modules/leave-requests/leave.routes";
import schedulesRoutes from "./modules/schedules/schedules.routes";
import locationsRoutes from "./modules/locations/locations.routes";
import authProvidersRoutes from "./modules/auth-providers/provider.routes";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/employees", employeesRoutes);
app.use("/teams", teamsRoutes);
app.use("/departments", departmentsRoutes);
app.use("/organisations", organisationsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/leave", leaveRoutes);
app.use("/schedules", schedulesRoutes);
app.use("/locations", locationsRoutes);
app.use("/auth-providers", authProvidersRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
