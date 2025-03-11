import 'react-native';
import React from 'react';
import LoginScreen from '../app/login';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<LoginScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  test("shows login button when no token is found", async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const { getByText } = render(<LoginScreen />);

      await waitFor(() => {
          expect(getByText("Login with UCSD Email")).toBeTruthy();
      });
  });
});