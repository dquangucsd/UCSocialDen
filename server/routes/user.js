const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {getUserByEmail, joinEvent, register, updateImage,updateUserIntro} = require("../controller/userController");


const router = express.Router();``

// router.get("/", getUsers);
router.get("/:email", getUserByEmail); //: means input
router.put("/:email/intro", updateUserIntro)
router.put('/profile_photo/:email', upload.single("profilePhoto"), updateImage);
router.post('/:eventId/join', joinEvent);
router.post('/register', upload.single("profilePhoto"), register);
// router.get("/image/:email", getImageByEmail);
module.exports = router;