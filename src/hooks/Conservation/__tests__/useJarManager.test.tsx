import { renderHook, act } from '@testing-library/react-hooks';
import { useJarManager } from '../useJarManager';

const mockItem = {
  name: 'Jam',
  history: {
    '2021': {
      jarCounts: {
        jar2_3l: 1,
        jar4_2l: 2,
        jar7_15l: 0,
        jar2_1l: 0,
        jar1_05l: 0,
      },
      period: 2,
    },
    '2022': {
      jarCounts: {
        jar2_3l: 3,
        jar4_2l: 0,
        jar7_15l: 0,
        jar2_1l: 0,
        jar1_05l: 0,
      },
      period: 3,
    },
  },
};

describe('useJarManager hook', () => {

  it('initializes with first year from history', () => {
    const { result } = renderHook(() => useJarManager(mockItem));

    expect(result.current.selectedYear).toBe('2021');
    expect(result.current.jarCounts.jar2_3l).toBe(1);
  });

  it('changes year correctly', () => {
    const { result } = renderHook(() => useJarManager(mockItem));

    act(() => {
      result.current.handleYearChange('2022');
    });

    expect(result.current.selectedYear).toBe('2022');
    expect(result.current.jarCounts.jar2_3l).toBe(3);
  });

  it('updates jar count and creates draft', () => {
    const { result } = renderHook(() => useJarManager(mockItem));

    act(() => {
      result.current.updateJarCount('jar2_3l', 5);
    });

    expect(result.current.jarCounts.jar2_3l).toBe(5);
    expect(result.current.drafts['2021'].jar2_3l).toBe(5);
  });

  it('calculates total jars for current year', () => {
    const { result } = renderHook(() => useJarManager(mockItem));

    expect(result.current.totalJarsCurrentYear).toBe(3);
  });

  it('calculates total jars across all years', () => {
    const { result } = renderHook(() => useJarManager(mockItem));

    expect(result.current.totalJarsAllYears).toBe(6);
  });

});