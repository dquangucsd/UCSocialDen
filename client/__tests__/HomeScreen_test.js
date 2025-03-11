//// filepath: /Users/junhaoqu/Desktop/210/UCSocialDen/client/__tests__/HomeScreen_test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../app/HomeScreen';
import { AuthContext } from '../contexts/AuthContext';
import { act } from 'react-test-renderer';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({
    user: { _id: 'test123', name: 'Test User' },
    token: 'fake-token'
  }))),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock fetch to return arrays
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { _id: '1', name: 'Event 1', start_time: '2025-03-15T12:00:00Z' },
      { _id: '2', name: 'Event 2', start_time: '2025-03-16T12:00:00Z' }
    ])
  })
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    isReady: true,
  })),
}));

// Increase test timeout
jest.setTimeout(10000);

describe('HomeScreen', () => {
  it('renders correctly', async () => {
    const mockAuthContext = {
      userData: { name: 'User' },
      profileImage: 'fake_url',
      isLoggedIn: true, // Important to add this
    };

    const { getAllByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <HomeScreen />
      </AuthContext.Provider>
    );

    // Wait with a longer timeout for any async state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    // If there's more than one "Today," check at least one is present:
    expect(getAllByText('Today').length).toBeGreaterThan(0);
  });
});