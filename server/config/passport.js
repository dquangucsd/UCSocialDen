const passport = require("passport"); // passport.js is a middleware for authentication
const GoogleStrategy = require("passport-google-oauth20").Strategy; // google strategy for auth2.0
const dotenv = require("dotenv");  // dotenv is a module that loads environment variables 
                                   // from a .env file into process.env. 
                                   //.env is a file that contains environment variables, and 
                                   // it contains sensitive information like passwords and api keys.
const jwt = require("jsonwebtoken"); // jwt is a module that generates and verifies json web tokens. 
                                     // It is used to authenticate users. Use instead of session/cookies
const User = require("../models/userModel");


/*
    Main function to handle google login. Check database. If user exists, generate token and login. If not, redirect to register.
    Passport.js : configure the passport dependency. return token and login with google provides you with a profile
    auth.js     : use the token and pass to the front end
    server.js   : start the server and call all the routes
*/


dotenv.config();

passport.use(
    new GoogleStrategy(
        // connect to Google cloud client
        {
            clientID: process.env.GOOGLE_CLIENT_ID,  
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
            callbackURL: "/auth/google/callback",  
        },
      // login by google, profile is the google's profile. pops up a window to login with google
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google Profile:", profile);
                
                const email = profile.emails[0].value;
                // TODO: check is ucsd.edu email
                // TODO: figure out how jwt works
                // TODO: check token variables like email and names
                if (email.split("@")[1] !== "ucsd.edu") {
                    console.log("False. Not ucsd email");
                    return done(new Error("Not a UCSD email address.")); // return condition to register to auth.js
                }

                let user = await User.findOne({_id: email}); // check the email in our database
                if (!user){
                    console.log("False. Email doesn't exist in google"); // there is no google account in our database that matches, 
                                                                         // then they should register.
                    return done(null, {newUser: true, email}); // return condition to register to auth.js
                }
                
                const token = jwt.sign( // here, the email is in our database, then we can generate a token and log the user in
                    { // object aka payload
                        email: user.email,
                        name: user.name,
                        image: user.profile_photo
                    },
                    process.env.JWT_SECRET, // secret key, available for 1 hr. if expires, log in again
                    { expiresIn: "1h" }
                )
                // const user = { // session, but we decide to use jwt because we want to separate front and back end for more security
                //     id: profile.id,
                //     displayName: profile.displayName,
                //     email: profile.emails[0].value,
                // //avatar: profile.photos[0].value,
                // };
                // create token
                
    
                return done(null, { user, token }); // return token and user to auth.js
            } 
            catch (error) {
                return done(error, null);
            }
        }
    )
  );