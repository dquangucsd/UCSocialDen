//// filepath: /Users/junhaoqu/Desktop/210/UCSocialDen/client/__tests__/Profile_test.js
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Profile from '../app/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authUtils from '../utils/auth';

// Mock checkTokenExpiration to always return valid
jest.spyOn(authUtils, 'checkTokenExpiration').mockResolvedValue(true);

// Mock AsyncStorage completely
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => {
    if (key === "user") {
      return Promise.resolve(JSON.stringify({
        user: {
          name: "TestUser",
          _id: "test@example.com",
          major: "Computer Science",
          intro: "This is an introduction",
          profile_photo: "https://example.com/photo.jpg"
        }
      }));
    }
    return Promise.resolve(null);
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock fetch calls
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    push: jest.fn(),
    isReady: true,
  })),
}));

describe('Profile page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user info from AsyncStorage', async () => {
    const { getByText } = render(<Profile />);

    // Add longer timeout for slow test environments
    await waitFor(() => {
      expect(getByText('TestUser')).toBeTruthy();
    }, { timeout: 5000 });
    
    await waitFor(() => {
      expect(getByText('test@example.com')).toBeTruthy();
      expect(getByText('Computer Science')).toBeTruthy();
      expect(getByText('This is an introduction')).toBeTruthy();
    });
  });
});