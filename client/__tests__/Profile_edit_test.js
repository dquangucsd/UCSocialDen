//// filepath: /Users/junhaoqu/Desktop/210/UCSocialDen/client/__tests__/Profile_edit_test.js
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import EditProfile from '../app/edit-profile';
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

// Mock image picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file://test/image.jpg' }]
  }),
  MediaTypeOptions: {
    Images: 'Images'
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    isReady: true,
  })),
}));

describe('EditProfile page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with user data from AsyncStorage', async () => {
    const { getByText, getByPlaceholderText } = render(<EditProfile />);

    // Wait for component to load user data
    await waitFor(() => {
      // Check for the page title
      expect(getByText('Edit Profile')).toBeTruthy();
    }, { timeout: 5000 });

    // Check that form displays user data based on actual component structure
    await waitFor(() => {
      // Check major field
      const majorField = getByPlaceholderText('Major');
      expect(majorField.props.value).toBe('Computer Science');
      
      // Check bio field
      const bioField = getByPlaceholderText('About Me');
      expect(bioField.props.value).toBe('This is an introduction');
      
      // Check for UI elements that should appear
      expect(getByText('Change Photo')).toBeTruthy();
      expect(getByText('Update Profile')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });
  });

  it('renders without crashing', async () => {
    const { getByText } = render(<EditProfile />);
    
    // Just test that the component renders without throwing an error
    await waitFor(() => {
      expect(getByText('Edit Profile')).toBeTruthy();
    }, { timeout: 5000 });
  });
});