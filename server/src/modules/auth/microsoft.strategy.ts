import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { User } from "../../types/user";

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      callbackURL: "/auth/microsoft/callback",
      scope: ["user.read"],
    },
    async (
      _accessToken: string, // unused, prefixed with _ to avoid TS warning
      _refreshToken: string, // unused
      profile: any,
      done: (err: any, user?: User) => void
    ) => {
      const user: User = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        role: "employee",
      };

      done(null, user);
    }
  )
);
