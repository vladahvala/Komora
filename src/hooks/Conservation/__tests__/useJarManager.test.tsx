import { renderHook, act } from '@testing-library/react';

const baseItem = {
  history: {
    "2021": {
      jarCounts: {
        jar2_3l: 1,
        jar4_2l: 2,
        jar7_15l: 3,
        jar2_1l: 4,
        jar1_05l: 5,
      },
      period: 2,
    },
    "2022": {
      jarCounts: {
        jar2_3l: 1,
        jar4_2l: 1,
        jar7_15l: 1,
        jar2_1l: 1,
        jar1_05l: 1,
      },
      period: 1,
    },
  },
};

import { useJarManager } from '../useJarManager';

describe('useJarManager', () => {
  test('initializes with first year data', () => {
    const { result } = renderHook(() => useJarManager(baseItem));

    expect(result.current.selectedYear).toBe('2021');

    expect(result.current.jarCounts.jar2_3l).toBe(1);

    expect(result.current.totalJarsCurrentYear).toBe(15);
  });

  test('switch year updates data', () => {
    const { result } = renderHook(() => useJarManager(baseItem));

    act(() => {
      result.current.handleYearChange('2022');
    });

    expect(result.current.selectedYear).toBe('2022');

    expect(result.current.jarCounts.jar2_3l).toBe(1);
    expect(result.current.totalJarsCurrentYear).toBe(5);
  });

  test('updateJarCount updates state and drafts', () => {
    const { result } = renderHook(() => useJarManager(baseItem));

    act(() => {
      result.current.updateJarCount('jar2_3l', 10);
    });

    expect(result.current.jarCounts.jar2_3l).toBe(10);
    expect(result.current.drafts['2021'].jar2_3l).toBe(10);
  });

  test('expiration logic works', () => {
    const { result } = renderHook(() => useJarManager(baseItem));

    // 2021 + period 2 = 2023
    expect(result.current.expirationYear).toBe(2023);
  });
});