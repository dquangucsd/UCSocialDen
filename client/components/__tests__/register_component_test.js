import 'react-native';
import React from 'react';
import LoginScreen from '../../app/login';
import { render } from '@testing-library/react-native';

// Mock AsyncStorage

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<LoginScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});


