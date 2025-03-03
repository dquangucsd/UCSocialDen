const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {getUsers, getUserByEmail, updateUserIntro, updateimage, uploadImage, joinEvent, register} = require("../controller/userController");


const router = express.Router();

router.get("/", getUsers);
router.get("/:email", getUserByEmail); //: means input
router.put("/:email/intro", updateUserIntro)
router.post('/upload/:email', upload.single("profile_image"), updateimage);
router.post('/:eventId/join', joinEvent);
router.post('/register', upload.single("profilePhoto"), register);

module.exports = router;