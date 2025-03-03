const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Event = require('../models/eventModel'); 
const User = require('../models/userModel');
const { getAllEvents, createEvent, getEventsByUser } = require('../controller/eventController');

describe('Event Controller', () => {
  let mongoServer;

  beforeAll(async () => {
    //initialize the in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    //disconnect from the in-memory MongoDB instance
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    //clean up the database after each test
    await Event.deleteMany();
    await User.deleteMany();
  });
  
  //add a simple test to ensure the test suite can run
  it('should pass a simple test', () => {
    expect(true).toBe(true);
  });
});
