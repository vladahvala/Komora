import { renderHook, act } from '@testing-library/react-hooks';
import { useCategoryPage } from '../useCategoryPage';
import { ConservationContext } from '../../../context/ConservationContext';
import React from 'react';
// Мок conservations

jest.mock('../../../context/ConservationContext', () => {
    const React = require('react');
    return {
      ConservationContext: React.createContext({
        conservations: [],
      }),
    };
  });
const mockConservations = [
  {
    name: 'Jam',
    category: 'Fruits',
    imageUri: 'jam.jpg',
    history: {
      '2021': { jarCounts: { jar2_3l: 0, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 }, period: 1 },
      '2022': { jarCounts: { jar2_3l: 1, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 }, period: 2 },
    },
  },
  {
    name: 'Pickles',
    category: 'Vegetables',
    imageUri: 'pickles.jpg',
    history: {
      '2021': { jarCounts: { jar2_3l: 0, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 }, period: 1 },
    },
  },
  {
    name: 'Honey',
    category: 'Fruits',
    imageUri: 'honey.jpg',
    history: {
      '2021': { jarCounts: { jar2_3l: 0, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 }, period: 1 },
    },
  },
];

// Мок усіх полів контексту
const mockContextValue = {
    conservations: mockConservations,
    emptyJars: {
      jar2_3l: 0,
      jar4_2l: 0,
      jar7_15l: 0,
      jar2_1l: 0,
      jar1_05l: 0,
    },
    addConservation: jest.fn(),
    loadConservations: jest.fn(),
    updateJarHistory: jest.fn(),
    updateImage: jest.fn(),
    removeConservation: jest.fn(),
    updateCategory: jest.fn(),
    deleteConservation: jest.fn(),
    updateEmptyJars: jest.fn(),
  };

describe('useCategoryPage hook', () => {
    

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        ConservationContext.Provider,
        { value: mockContextValue },
        children
      );

  it('filters conservations by category (case-insensitive)', () => {
    const { result } = renderHook(() => useCategoryPage('fruits'), { wrapper });
    expect(result.current.filteredConservations).toEqual([mockConservations[0], mockConservations[2]]);
  });

  it('returns empty array if no items match category', () => {
    const { result } = renderHook(() => useCategoryPage('Dairy'), { wrapper });
    expect(result.current.filteredConservations).toEqual([]);
  });

  it('toggles isBigIcon state', () => {
    const { result } = renderHook(() => useCategoryPage('Fruits'), { wrapper });
    expect(result.current.isBigIcon).toBe(true);

    act(() => result.current.toggleIcon());
    expect(result.current.isBigIcon).toBe(false);

    act(() => result.current.toggleIcon());
    expect(result.current.isBigIcon).toBe(true);
  });
});