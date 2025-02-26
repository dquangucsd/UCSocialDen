const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Google login api
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// login callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false  }),
    (req, res) => { // req holds { user, token }, it is the answer from passport.js
        if (!req.user) { 
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }
        
        // if not sucessful, return error message
        if (req.user.error) {
            return res.status(401).json({ success: false, message: req.user.error });
        }

        // if success get information for user

        if (req.user.newUser) { // redirects you to register
            // reg TODO
            return res.redirect(`http://localhost:8081/register?email=${req.user.email}`); // first we send new user to register. 
                                                                                           // after user registers, we send them back to login again
        }
    
        // get token and user information
        const { token, user } = req.user; // login
    
        // redirect to homepage with token, meaning you are logged in with the homepage
        // res.json({ token, user });
        res.redirect(`http://localhost:8081/oauth-handler?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
);

// log out
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;