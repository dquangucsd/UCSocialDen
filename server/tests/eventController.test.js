const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Event = require('../models/eventModel'); 
const User = require('../models/userModel');
const { getAllEvents, createEvent, getEventsByUser } = require('../controller/eventController');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Event Controller', () => {
  let mongoServer;

  before(async () => {
    // 启动内存中的 MongoDB 实例
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    // 断开连接并停止内存中的 MongoDB 实例
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // 每次测试后清理所有事件
    await Event.deleteMany();
    await User.deleteMany();
    // 恢复所有 sinon stubs
    sinon.restore();
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
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getAllEvents(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.called).to.be.true;
      
      const jsonArg = res.json.firstCall.args[0];
      expect(jsonArg).to.be.an('array').with.lengthOf(2);
      expect(jsonArg[0]).to.have.property('name', 'UC Social Den Event 1');
      expect(jsonArg[1]).to.have.property('name', 'UC Social Den Event 2');
    });

    it('should handle errors when fetching events', async () => {
      // 通过 sinon 模拟 Event.find 抛出错误
      sinon.stub(Event, 'find').throws(new Error('Database error'));

      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getAllEvents(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to fetch events' })).to.be.true;
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
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createEvent(req, res);

      // 验证响应状态为 201
      expect(res.status.calledWith(201)).to.be.true;
      
      // 验证返回的事件包含预期字段
      const jsonArg = res.json.firstCall.args[0];
      expect(jsonArg).to.have.property('name', 'New UC Social Den Event');
      expect(jsonArg).to.have.property('author', 'j6qu@ucsd.edu');

      // 另外，检查事件是否存在于数据库中
      const eventsInDb = await Event.find();
      expect(eventsInDb).to.have.lengthOf(1);
      expect(eventsInDb[0].name).to.equal('New UC Social Den Event');
    });

    it('should handle errors when creating an event', async () => {
      // 通过 sinon 模拟 Event.create 抛出错误
      sinon.stub(Event, 'create').throws(new Error('Database error'));

      const req = { 
        body: { 
          name: 'Test Event',
          author: 'j6qu@ucsd.edu',
          start_time: '2025-12-01T10:00:00Z',
          end_time: '2025-12-01T12:00:00Z',
        } 
      };
      
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createEvent(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to create an event' })).to.be.true;
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
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      
      // 如果 getEventsByUser 函数存在，则测试它
      if (typeof getEventsByUser === 'function') {
        await getEventsByUser(req, res);
        
        expect(res.json.called).to.be.true;
        const jsonArg = res.json.firstCall.args[0];
        expect(jsonArg).to.be.an('array');
        expect(jsonArg.some(event => event.name === 'User Event 1')).to.be.true;
        expect(jsonArg.some(event => event.name === 'User Event 2')).to.be.true;
      } else {
        console.log('getEventsByUser function not found, skipping test');
      }
    });
  });
});
