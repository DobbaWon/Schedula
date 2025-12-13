import session, { SessionOptions } from "express-session";

export const sessionConfig: SessionOptions = {
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    httpOnly: true, // prevents client JS access
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  },
};
