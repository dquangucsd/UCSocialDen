jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
      replace: jest.fn(),
      push: jest.fn(),
      back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSegments: jest.fn(() => []),
}));