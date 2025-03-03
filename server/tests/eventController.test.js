const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Event = require('../models/eventModel'); 
const User = require('../models/userModel');
const { getAllEvents, createEvent, getEventsByUser } = require('../controller/eventController');

describe('Event Controller', () => {
  let mongoServer;

  beforeAll(async () => {
    // 启动内存中的 MongoDB 实例
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // 断开连接并停止内存中的 MongoDB 实例
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // 每次测试后清理所有事件
    await Event.deleteMany();
    await User.deleteMany();
  });
});
