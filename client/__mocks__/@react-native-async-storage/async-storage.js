const mockAsyncStorage = {
  getItem: jest.fn(() => Promise.resolve('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5kb2VAdWNzZC5lZHUifQ.ajTKW1b9PxsPX3aoms-Zq8mlr3cIi25eeN1Un156KFY')),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
};

export default mockAsyncStorage;