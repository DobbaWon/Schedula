import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";

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

// Middleware
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/organisations", organisationsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/schedules", schedulesRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/auth-providers", authProvidersRoutes);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
