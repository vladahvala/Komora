import { renderHook, act } from '@testing-library/react';
import React from 'react';

// mock data
const mockConservations = [
  { name: 'Jam', category: 'Food' },
  { name: 'Pickles', category: 'Food' },
  { name: 'Soap', category: 'Other' },
];

// 👇 МОК КОНТЕКСТУ ПРАВИЛЬНО
jest.mock('../../../context/ConservationContext', () => {
  const React = require('react');

  return {
    ConservationContext: React.createContext(null),
    useContext: React.useContext,
  };
});

// 👇 ми підміняємо useContext через spy (АЛЕ без crash)
const mockUseContext = jest.spyOn(React, 'useContext');

mockUseContext.mockImplementation(() => ({
  conservations: mockConservations,
}));

import { useCategoryPage } from '../useCategoryPage';

describe('useCategoryPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('filters conservations by category (case insensitive)', () => {
    const { result } = renderHook(() => useCategoryPage('food'));

    expect(result.current.filteredConservations).toEqual([
      { name: 'Jam', category: 'Food' },
      { name: 'Pickles', category: 'Food' },
    ]);
  });

  test('toggleIcon switches isBigIcon value', () => {
    const { result } = renderHook(() => useCategoryPage('food'));

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });

  test('returns empty array if no matches', () => {
    const { result } = renderHook(() => useCategoryPage('non-existing'));

    expect(result.current.filteredConservations).toEqual([]);
  });
});