import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here you can call a userService to find or create the user
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        role: "employee", // default role
      };
      done(null, user);
    }
  )
);

passport.serializeUser((user: Express.User, done) => done(null, user));
passport.deserializeUser((obj: Express.User, done) => done(null, obj));
