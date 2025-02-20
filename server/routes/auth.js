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
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }

        // if success get information for user

        if (req.user.newUser) {
            // reg TODO
            return res.redirect(`http://localhost:8081/register?email=${req.user.email}`);
        }
    
        // get token and user information
        const { token, user } = req.user;
    
        // redirect to homepage with token
        res.redirect(`http://localhost:8081?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    }
);

// log out
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;