const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

dotenv.config();

passport.use(
    new GoogleStrategy(
        // Google cloud client
        {
            clientID: process.env.GOOGLE_CLIENT_ID,  
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
            callbackURL: "/auth/google/callback",  
        },
      // login by google, profile is the google's profile
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google Profile:", profile);
                
                const email = profile.emails[0].value;

                let user = await User.findOne({_id: email});
                if (!user){
                    console.log("FAlse");
                    return done(null, {newUser: true, email});
                }
                
                const token = jwt.sign(
                    {
                        email: user.email,
                        name: user.name,
                        image: user.profile_photo
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                )
                // const user = {
                //     id: profile.id,
                //     displayName: profile.displayName,
                //     email: profile.emails[0].value,
                // //avatar: profile.photos[0].value,
                // };
                // create token
                
    
                return done(null, { user, token });
            } 
            catch (error) {
                return done(error, null);
            }
        }
    )
  );