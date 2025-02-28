const express = require("express");
const {getUsers, getUserByEmail, updateUserIntro, uploadimage,Upload, joinEvent, register} = require("../controller/userController");


const router = express.Router();

router.get("/", getUsers);
router.get("/:email", getUserByEmail); //: means input
router.put("/:email/intro", updateUserIntro)
router.post('/upload/:email', Upload, uploadimage);
router.post('/:eventId/join', joinEvent);
router.post('/register', register);

module.exports = router;