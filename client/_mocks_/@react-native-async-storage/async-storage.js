const mockAsyncStorage = {
    getItem: jest.fn((key) => {
      if (key === "user") {
        return Promise.resolve(JSON.stringify({ user: { _id: "user123" } })); 
      }
      return Promise.resolve(null); 
    }),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  };
  
  export default mockAsyncStorage;
  