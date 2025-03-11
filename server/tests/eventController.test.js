const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Event = require('../models/eventModel'); 
const User = require('../models/userModel');
const { getAllEvents, createEvent, getEventsByIds } = require('../controller/eventController');

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
  // it('should pass a simple test', () => {
  //   expect(true).toBe(true);
  // });

  describe('getAllEvents', () => {
    it('should return an empty array if there are no events', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return all events', async () => {
      const event1 = new Event({
        name: 'Event 1',
        description: 'Description 1',
        author: 'author1',
        location: 'sd, ca',
        start_time: new Date(),
        end_time: new Date(),
      });
      const event2 = new Event({
        name: 'Event 2',
        description: 'Description 2',
        author: 'author2',
        location: 'la, ca',
        start_time: new Date(),
        end_time: new Date(),
      });

      await event1.save();
      await event2.save();

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData[0].name).toBe('Event 1');
      expect(responseData[1].name).toBe('Event 2');
    });
  });



  // describe('createEvent', () => {
  //   it('should create a new event', async () => {
  //     const req = {
  //       body: {
  //         name: 'Event 1',
  //         description: 'Description 1',
  //         location: 'sd, ca',
  //         start_time: new Date(),
  //         end_time: new Date(),
  //       },
  //       params: {
  //         userID: 'author1',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };

  //     await createEvent(req, res);

  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalled();
  //     const responseData = res.json.mock.calls[0][0];
  //     console.log("gello")
  //     console.log(res.json.mock.calls[0]);
  //     expect(responseData.name).toBe('Event 1');
  //     expect(responseData.description).toBe('Description 1');
  //     expect(responseData.author).toBe('author1');
  //   });

  //   it('should return 500 if there is an error', async () => {
  //     const req = {
  //       body: {
  //         name: 'Event 1',
  //         description: 'Description 1',
  //         location: 'sd, ca',
  //         start_time: new Date(),
  //         end_time: new Date(),
  //       },
  //       params: {
  //         userID: 'author1',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };

  //     jest.spyOn(Event, 'create').mockRejectedValue(new Error('Some error'));

  //     await createEvent(req, res);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create an event' });
  //   });
  // });



  describe("createEvent", () => {
    afterEach(() => {
      jest.restoreAllMocks(); // Reset all mocks after each test
    });

    it("should create a new event successfully", async () => {
      const mockEvent = {
        _id: new mongoose.Types.ObjectId(),
        name: "Event 1",
        description: "Description 1",
        location: "sd, ca",
        start_time: new Date(),
        end_time: new Date(),
        create_time: new Date(),
        author: "author1",
      };

      const req = {
        body: {
          name: "Event 1",
          description: "Description 1",
          location: "sd, ca",
          start_time: new Date(),
          end_time: new Date(),
        },
        params: {
          userID: "author1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock Event.create to return the event
      jest.spyOn(Event, "create").mockResolvedValue(mockEvent);

      // Mock User.findById to return a user object
      jest.spyOn(User, "findById").mockResolvedValue({
        _id: "author1",
        joinedEvents: [],
        save: jest.fn().mockResolvedValue(),
      });

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it("should return 500 if Event.create fails", async () => {
      const req = {
        body: {
          name: "Event 1",
          description: "Description 1",
          location: "sd, ca",
          start_time: new Date(),
          end_time: new Date(),
        },
        params: {
          userID: "author1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock Event.create to throw an error
      jest.spyOn(Event, "create").mockRejectedValue(new Error("Some error"));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to create an event" });
    });

    it("should return 500 if User.findById fails", async () => {
      const mockEvent = {
        _id: new mongoose.Types.ObjectId(),
        name: "Event 1",
        description: "Description 1",
        location: "sd, ca",
        start_time: new Date(),
        end_time: new Date(),
        create_time: new Date(),
        author: "author1",
      };

      const req = {
        body: {
          name: "Event 1",
          description: "Description 1",
          location: "sd, ca",
          start_time: new Date(),
          end_time: new Date(),
        },
        params: {
          userID: "author1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(Event, "create").mockResolvedValue(mockEvent);
      jest.spyOn(User, "findById").mockRejectedValue(new Error("User not found"));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to add the event to the user's joinedEvents",
      });
    });
  });






  describe("GET /:userID - getEventsByIds", () => {
    afterEach(() => {
      jest.restoreAllMocks(); // Clean up mocks after each test
    });
  
    it("should return the user's joined events", async () => {
      const mockEvents = [
        { _id: new mongoose.Types.ObjectId(), name: "Event 1" },
        { _id: new mongoose.Types.ObjectId(), name: "Event 2" },
      ];
  
      const req = {
        params: {
          userID: "author1",
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock User.findById().populate() to return a user with joinedEvents
      jest.spyOn(User, "findById").mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: "author1",
          joinedEvents: mockEvents,
        }),
      });
  
      await getEventsByIds(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });
  
    it("should return 404 if the user is not found", async () => {
      const req = {
        params: {
          userID: "nonexistentUser",
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.spyOn(User, "findById").mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
  
      await getEventsByIds(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to find the user" });
    });
  
    it("should return 500 if an error occurs", async () => {
      const req = {
        params: {
          userID: "author1",
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.spyOn(User, "findById").mockImplementation(() => {
        throw new Error("Database error");
      });
  
      await getEventsByIds(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch joined events" });
    });
  });

});
