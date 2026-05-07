import { renderHook, act } from '@testing-library/react';

// mocks
const loadOthersMock = jest.fn();

jest.mock('../../../context/OthersContext', () => ({
  useOthers: () => ({
    others: [
      { name: 'Apple Juice' },
      { name: 'Orange Juice' },
      { name: 'Milk' },
    ],
    loadOthers: loadOthersMock,
    loading: false,
  }),
}));

import { useOthersMain } from '../useOthersMain';

describe('useOthersMain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls loadOthers on mount', () => {
    renderHook(() => useOthersMain());

    expect(loadOthersMock).toHaveBeenCalledTimes(1);
  });

  test('initial state is correct', () => {
    const { result } = renderHook(() => useOthersMain());

    expect(result.current.searchText).toBe('');
    expect(result.current.isBigIcon).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.filteredData.length).toBe(3);
  });

  test('toggleIcon changes isBigIcon state', () => {
    const { result } = renderHook(() => useOthersMain());

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(true);
  });

  test('filters products by search text', () => {
    const { result } = renderHook(() => useOthersMain());

    act(() => {
      result.current.setSearchText('apple');
    });

    expect(result.current.filteredData.length).toBe(1);

    expect(result.current.filteredData[0].name).toBe(
      'Apple Juice'
    );
  });

  test('filter is case insensitive', () => {
    const { result } = renderHook(() => useOthersMain());

    act(() => {
      result.current.setSearchText('ORANGE');
    });

    expect(result.current.filteredData.length).toBe(1);

    expect(result.current.filteredData[0].name).toBe(
      'Orange Juice'
    );
  });

  test('returns empty array when nothing found', () => {
    const { result } = renderHook(() => useOthersMain());

    act(() => {
      result.current.setSearchText('bread');
    });

    expect(result.current.filteredData).toEqual([]);
  });
});