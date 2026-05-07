import { renderHook, act } from '@testing-library/react';

// mocks
const startMock = jest.fn();
const stopMock = jest.fn();
const setValueMock = jest.fn();
const exitAppMock = jest.fn();

jest.mock('react-native', () => ({
  Animated: {
    Value: jest.fn(() => ({
      setValue: setValueMock,
    })),
    timing: jest.fn(() => ({
      start: startMock,
      stop: stopMock,
    })),
  },

  BackHandler: {
    exitApp: exitAppMock,
  },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: any) => {
    const cleanup = callback();

    if (cleanup) {
      cleanup();
    }
  },
}));

import { Animated, BackHandler } from 'react-native';
import { useMainMenuAnimation } from '../useMainMenuAnimation';

describe('useMainMenuAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates opacity animation', () => {
    renderHook(() => useMainMenuAnimation());

    expect(Animated.Value).toHaveBeenCalledWith(0);

    expect(Animated.timing).toHaveBeenCalledWith(
      expect.anything(),
      {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }
    );
  });

  test('starts animation on focus', () => {
    renderHook(() => useMainMenuAnimation());

    expect(setValueMock).toHaveBeenCalledWith(0);
    expect(startMock).toHaveBeenCalled();
  });

  test('stops animation on cleanup', () => {
    renderHook(() => useMainMenuAnimation());

    expect(stopMock).toHaveBeenCalled();
  });

  test('exitApp calls BackHandler.exitApp', () => {
    const { result } = renderHook(() =>
      useMainMenuAnimation()
    );

    act(() => {
      result.current.exitApp();
    });

    expect(BackHandler.exitApp).toHaveBeenCalled();
  });
});