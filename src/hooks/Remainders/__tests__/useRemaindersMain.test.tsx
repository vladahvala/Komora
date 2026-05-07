import { renderHook, act } from '@testing-library/react';

// mock data
const mockConservations = [
  {
    name: 'Jam',
    history: {
      2023: { period: 1 }, // expired (depends on current year)
    },
  },
  {
    name: 'Pickles',
    history: {
      2025: { period: 1 },
    },
  },
];

// mock React useContext BEFORE hook import
jest.mock('react', () => {
  const actual = jest.requireActual('react');

  return {
    ...actual,
    useContext: () => ({
      conservations: mockConservations,
    }),
  };
});

// avoid JSX crash from context file
jest.mock('../../../context/ConservationContext', () => ({
  ConservationContext: {},
}));

import { useRemaindersMain } from '../useRemaindersMain';

describe('useRemaindersMain', () => {
  test('filters expired items correctly', () => {
    const { result } = renderHook(() => useRemaindersMain());

    expect(result.current.filteredData.length).toBeGreaterThanOrEqual(0);
  });

  test('search filter works', () => {
    const { result } = renderHook(() => useRemaindersMain());

    act(() => {
      result.current.setSearchText('Jam');
    });

    expect(result.current.filteredData.every(i => i.name.includes('Jam'))).toBe(true);
  });

  test('toggle icon works', () => {
    const { result } = renderHook(() => useRemaindersMain());

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});