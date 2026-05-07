import { renderHook, act } from '@testing-library/react';

// стабільний mock (ВАЖЛИВО)
const emptyJarsMock = {
  jar2_3l: 1,
  jar4_2l: 2,
  jar7_15l: 3,
  jar2_1l: 4,
  jar1_05l: 5,
};

const updateEmptyJarsMock = jest.fn();

jest.mock('../../../context/ConservationContext', () => ({
  useConservation: () => ({
    emptyJars: emptyJarsMock,
    updateEmptyJars: updateEmptyJarsMock,
  }),
}));

import { useEmptyJarsForm } from '../useEmptyJarsForm';

describe('useEmptyJarsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes localJars from context', () => {
    const { result } = renderHook(() => useEmptyJarsForm());

    expect(result.current.localJars).toEqual(emptyJarsMock);
  });

  test('calculates totalJars correctly', () => {
    const { result } = renderHook(() => useEmptyJarsForm());

    expect(result.current.totalJars).toBe(15);
  });

  test('setLocalJars updates state correctly', () => {
    const { result } = renderHook(() => useEmptyJarsForm());

    act(() => {
      result.current.setLocalJars({
        jar2_3l: 10,
        jar4_2l: 0,
        jar7_15l: 0,
        jar2_1l: 0,
        jar1_05l: 0,
      });
    });

    expect(result.current.localJars.jar2_3l).toBe(10);
    expect(result.current.totalJars).toBe(10);
  });

  test('saveChanges calls updateEmptyJars with local state', () => {
    const { result } = renderHook(() => useEmptyJarsForm());

    act(() => {
      result.current.saveChanges();
    });

    expect(updateEmptyJarsMock).toHaveBeenCalledWith(result.current.localJars);
  });
});