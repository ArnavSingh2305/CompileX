import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email returned from Google"));
        }

        // Case 1: Google account already linked
        let user = await User.findOne({
          googleId: profile.id,
        });

        // Case 2: Existing CompileX account with same email
        if (!user) {
          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;

            if (!user.authProviders.includes("google")) {
              user.authProviders.push("google");
            }

            // Google has authenticated the email.
            user.isVerified = true;

            await user.save();
          }
        }

        // Case 3: Brand-new Google account
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            authProviders: ["google"],
            isVerified: true,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;