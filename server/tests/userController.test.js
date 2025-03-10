const mongoose = require('mongoose');
require('dotenv').config();
const {
  getUserByEmail,
  updateUserIntro,
  updateImage,
  register,
  joinEvent
} = require('../controller/userController');
const User = require('../models/userModel');
const Event = require('../models/eventModel');

// Mock S3 client 
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({ success: true })
  })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn()
}));
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://fake-signed-url.com')
}));
console.log("MONGO_URI_TEST:", process.env.MONGO_URI);
beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST; 
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Event.deleteMany({});
});

describe('User Controller Tests', () => {
  describe('getUserByEmail', () => {
    it('should get user by email', async () => {
      // Create test user
      const user = await User.create({
        _id: 'test@ucsd.edu',
        name: 'Test User',
        major: 'Computer Science',
        profile_photo: 'test-photo-key'
      });

      const req = {
        params: { email: 'test@ucsd.edu' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.name).toBe('Test User');
    });

    it('should return 404 for non-existent user', async () => {
        const req = {
          params: { email: 'nonexistent@ucsd.edu' }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
    
        await getUserByEmail(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'User not found'
        });
      });
  });

  describe('updateUserIntro', () => {
    it('should update user intro and major', async () => {
      const user = await User.create({
        _id: 'test@ucsd.edu',
        name: 'Test User',
        major: 'Computer Science'
      });

      const req = {
        params: { email: 'test@ucsd.edu' },
        body: {
          intro: 'New intro',
          major: 'Data Science'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateUserIntro(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.user.intro).toBe('New intro');
      expect(responseData.user.major).toBe('Data Science');
    });
  });

  describe('joinEvent', () => {
    it('should allow user to join event', async () => {
      const user = await User.create({
        _id: 'test@ucsd.edu',
        name: 'Test User',
        joinedEvents: []
      });

      const event = await Event.create({
        _id: 1,  // Changed from number to string
        name: 'Test Event',
        author: 'organizer@ucsd.edu',
        location: 'UCSD Library',
        start_time: new Date(),
        end_time: new Date(Date.now() + 3600000),
        participant_limit: 10,
        cur_joined: 0,
        participants: []
      });
  
      const req = {
        params: { eventId: 1 },  // Changed from number to string
        body: { email: 'test@ucsd.edu' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await joinEvent(req, res);
  
      const updatedUser = await User.findOne({ _id: 'test@ucsd.edu' });
      const updatedEvent = await Event.findById(1); 
  
      //expect(updatedUser.joinedEvents).toContain(1);  
      //expect(updatedEvent.participants).toContain('test@ucsd.edu');
      expect(updatedEvent.cur_joined).toBe(1);
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      const req = {
        body: {
          email: 'new@ucsd.edu',
          name: 'New User',
          major: 'Computer Science',
          bio: 'Test bio'
        },
        file: {
          buffer: Buffer.from('test'),
          mimetype: 'image/jpeg',
          originalname: 'test.jpg'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const user = await User.findById('new@ucsd.edu');
      expect(user).toBeTruthy();
      expect(user.name).toBe('New User');
    });
  });
});
