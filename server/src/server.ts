import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth.routes";
import { sessionConfig } from "./config/session";

import "./auth/google.strategy";
import "./auth/microsoft.strategy";


const app = express();

// Middleware
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
