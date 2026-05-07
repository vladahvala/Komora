import { renderHook, act } from '@testing-library/react';
import React from 'react';

// mock data
const mockConservations = [
  { name: 'Jam' },
  { name: 'Pickles' },
  { name: 'Soap' },
];

// 🔥 mock module (context)
jest.mock('../../../context/ConservationContext', () => ({
  ConservationContext: {},
}));

// 🔥 mock useContext напряму
jest.spyOn(React, 'useContext').mockImplementation(() => ({
  conservations: mockConservations,
}));

import { useConservationMain } from '../useConservationMain';

describe('useConservationMain', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initial state is correct', () => {
    const { result } = renderHook(() => useConservationMain());

    expect(result.current.searchText).toBe('');
    expect(result.current.isBigIcon).toBe(true);
  });

  test('filters data by search text', () => {
    const { result } = renderHook(() => useConservationMain());

    act(() => {
      result.current.setSearchText('jam');
    });

    expect(result.current.filteredData).toEqual([
      { name: 'Jam' },
    ]);
  });

  test('filter is case insensitive', () => {
    const { result } = renderHook(() => useConservationMain());

    act(() => {
      result.current.setSearchText('SOUP'); // no match expected
    });

    expect(result.current.filteredData).toEqual([]);
  });

  test('toggleIcon changes state', () => {
    const { result } = renderHook(() => useConservationMain());

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});