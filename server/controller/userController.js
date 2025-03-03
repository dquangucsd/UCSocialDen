const mongoose = require("mongoose");
const { S3Client, PutObjectCommand , DeleteObjectCommand} = require("@aws-sdk/client-s3");
const User = require("../models/userModel");
const Event = require("../models/eventModel");




const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


// get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const getImageByEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.email, "-password");
    if (!user) {
      return {success: false, message: 'User not found'};
    }
    res.status(200).json(user.profile_photo);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.email, "-password"); //find user by email, from :email from frontend input
    if (!user) {
      return {success: false, message: 'User not found'};
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const joinEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email } = req.body;
    const { eventId } = req.params;

    const user = await User.findById(email).session(session);
    const event = await Event.findById(eventId).session(session);

    if (!user || !event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "User or Event not found" });
    }

    if (user.joinedEvents.includes(eventId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "User already joined this event" });
    }

    if (event.participant_limit > 0 && event.cur_joined >= event.participant_limit) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Event is full" });
    }

    user.joinedEvents.push(eventId);
    await user.save({ session });

    event.participants.push(email);
    event.cur_joined += 1;
    await event.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Successfully joined event", user, event });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    res.status(500).json({ success: false, message: "Failed to join event" });
  }
};

const updateUserIntro = async (req, res) => {
  try {
    const { email } = req.params;
    const { intro, major } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      email, //search for use by email
      { intro, major }, // update intro value
      { new: true, select: "-password" } //return updated user except password
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Update Intro User not found" });
    }
    // console.log(updatedUser);
    res.status(200).json({success: true, user: updatedUser});
  } catch (error) {
    console.error("Failed to update user's intro:", error);
    res.status(500).json({ success: false, message: "Failed to update user's intro" });
  }
};

// uploadImage, helper function for register
const uploadImage = async (file) => {
  try {
    if (!file) {
      console.log("No file received");
      return null;
    }
    const fileName = `avatars/${Date.now().toString()}-${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return s3Url;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};

const updateImage = async (req, res) => {
  try {
    const { email } = req.params;

    let profile_photo = null;
    // get image uri.
    if (req.file) {
      const uploadResponse = await uploadImage(req.file);
      console.log("profile photo aws uri:", uploadResponse);
      if (!uploadResponse) {
        return res.status(500).json({ success: false, message: "Profile photo upload failed." });
      }
      profile_photo = uploadResponse;
    }

    const updatedUser = await User.findByIdAndUpdate(
      email,
      { profile_photo },
      { new: true, select: "-password" } //return updated user except password
    );
    
    console.log("updated user:", updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Update profile photo: User not found" });
    }
    // console.log(updatedUser);
    res.status(200).json({success: true, user: updatedUser});
  } catch (error) {
    console.error("Profile Photo Update failed:", error);
    return res.status(500).json({ success: false, message: "Profile photo update failed." });
  }
}

// register main function 
const register = async (req, res) => {
  try {
    const { email, name, major, bio = "" } = req.body;

    if (!email || !name || !major) {
      return res.status(400).json({ success: false, message: "All required fields must be filled out." });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    let profilePhoto = null;
    // get image uri.
    if (req.file) {
      const uploadResponse = await uploadImage(req.file);
      console.log(uploadResponse);
      if (!uploadResponse) {
        return res.status(500).json({ success: false, message: "Profile photo upload failed." });
      }
      profilePhoto = uploadResponse;
    }

    user = new User({
      _id: email,
      email,
      name,
      major,
      bio,
      profile_photo: profilePhoto,
    });

    await user.save();
    
    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Failed to register user" });
  }
};




module.exports = {
  getUsers,
  getUserByEmail,
  updateUserIntro,
  uploadImage,
  joinEvent,
  register,
  updateImage,
  getImageByEmail
};