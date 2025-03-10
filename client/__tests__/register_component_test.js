import 'react-native';
import React from 'react';
import RegisterScreen from '../app/register';
import { render } from '@testing-library/react-native';



describe('RegisterScreen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<RegisterScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});


