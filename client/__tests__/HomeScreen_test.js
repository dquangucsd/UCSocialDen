//// filepath: /Users/junhaoqu/Desktop/210/UCSocialDen/client/__tests__/HomeScreen_test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../app/HomeScreen';
import { AuthContext } from '../contexts/AuthContext';
import { act } from 'react-test-renderer';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    isReady: true,
  })),
}));

describe('HomeScreen', () => {
  it('renders correctly', async () => {
    const mockAuthContext = {
      userData: { name: 'User' },
      profileImage: 'fake_url',
    };

    const { getAllByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <HomeScreen />
      </AuthContext.Provider>
    );

    // Wait for any async state updates
    await act(async () => {});

    // If there's more than one "Today," check at least one is present:
    expect(getAllByText('Today').length).toBeGreaterThan(0);
  });
});