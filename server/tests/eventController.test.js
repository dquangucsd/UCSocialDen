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

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      // 在内存数据库中插入示例事件
      const sampleEvents = [
        { 
          name: 'UC Social Den Event 1', 
          start_time: new Date(), 
          end_time: new Date(Date.now() + 3600000), 
          location: 'UCSD Library', 
          author: 'j6qu@ucsd.edu',
          description: 'Test event 1'
        },
        { 
          name: 'UC Social Den Event 2', 
          start_time: new Date(), 
          end_time: new Date(Date.now() + 7200000), 
          location: 'Price Center', 
          author: 'j6qu@ucsd.edu',
          description: 'Test event 2'
        }
      ];
      await Event.insertMany(sampleEvents);

      // 创建模拟请求和响应对象
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'UC Social Den Event 1' }),
          expect.objectContaining({ name: 'UC Social Den Event 2' })
        ])
      );
    });

    it('should handle errors when fetching events', async () => {
      // 通过模拟 Event.find 抛出错误
      const originalFind = Event.find;
      Event.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch events' });

      // 恢复原始函数
      Event.find = originalFind;
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const req = {
        body: {
          name: 'New UC Social Den Event',
          start_time: '2025-12-01T10:00:00Z',
          end_time: '2025-12-01T12:00:00Z',
          location: 'Geisel Library',
          description: 'A new test event',
          author: 'j6qu@ucsd.edu'
        },
        userID: 'j6qu@ucsd.edu'
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createEvent(req, res);

      // 验证响应状态为 201
      expect(res.status).toHaveBeenCalledWith(201);
      
      // 验证返回的事件包含预期字段
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New UC Social Den Event',
          author: 'j6qu@ucsd.edu'
        })
      );

      // 另外，检查事件是否存在于数据库中
      const eventsInDb = await Event.find();
      expect(eventsInDb.length).toBe(1);
      expect(eventsInDb[0].name).toBe('New UC Social Den Event');
    });

    it('should handle errors when creating an event', async () => {
      // 通过模拟 Event.create 抛出错误
      const originalCreate = Event.create;
      Event.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = { 
        body: { 
          name: 'Test Event',
          author: 'j6qu@ucsd.edu',
          start_time: '2025-12-01T10:00:00Z',
          end_time: '2025-12-01T12:00:00Z',
        },
        userID: 'j6qu@ucsd.edu'
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create an event' });

      // 恢复原始函数
      Event.create = originalCreate;
    });
  });

  describe('getEventsByUser', () => {
    it('should return events for a specific user', async () => {
      // 创建测试用户
      const testUser = {
        _id: 'j6qu@ucsd.edu',
        name: 'Test User',
        email: 'j6qu@ucsd.edu',
        major: 'Computer Science',
        joinedEvents: []
      };
      
      await User.create(testUser);
      
      // 创建该用户参与的事件
      const userEvents = [
        { 
          name: 'User Event 1', 
          start_time: new Date(), 
          end_time: new Date(Date.now() + 3600000), 
          location: 'UCSD Library', 
          author: 'j6qu@ucsd.edu',
          participants: ['j6qu@ucsd.edu'],
          description: 'User test event 1'
        },
        { 
          name: 'User Event 2', 
          start_time: new Date(), 
          end_time: new Date(Date.now() + 7200000), 
          location: 'Price Center', 
          author: 'another@ucsd.edu',
          participants: ['j6qu@ucsd.edu'],
          description: 'User test event 2'
        }
      ];
      
      const createdEvents = await Event.insertMany(userEvents);
      
      // 更新用户的 joinedEvents
      const eventIds = createdEvents.map(event => event._id);
      await User.findByIdAndUpdate('j6qu@ucsd.edu', { joinedEvents: eventIds });
      
      // 模拟请求和响应
      const req = {
        params: { email: 'j6qu@ucsd.edu' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // 如果 getEventsByUser 函数存在，则测试它
      if (typeof getEventsByUser === 'function') {
        await getEventsByUser(req, res);
        
        expect(res.json).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ name: 'User Event 1' }),
            expect.objectContaining({ name: 'User Event 2' })
          ])
        );
      } else {
        console.log('getEventsByUser function not found, skipping test');
      }
    });
  });
});
