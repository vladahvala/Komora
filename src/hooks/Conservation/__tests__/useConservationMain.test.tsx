jest.mock('../../../context/ConservationContext', () => {
    const React = require('react');
    return {
      ConservationContext: React.createContext({
        conservations: [],
      }),
    };
  });
  
  import { renderHook, act } from '@testing-library/react-hooks';
  import { useConservationMain } from '../useConservationMain';
  import { ConservationContext } from '../../../context/ConservationContext';
  import React from 'react';
  
  const mockConservations = [
    {
      name: 'Strawberry Jam',
      category: 'Fruits',
      imageUri: 'jam.jpg',
      history: {},
    },
    {
      name: 'Pickles',
      category: 'Vegetables',
      imageUri: 'pickles.jpg',
      history: {},
    },
    {
      name: 'Honey',
      category: 'Fruits',
      imageUri: 'honey.jpg',
      history: {},
    },
  ];
  
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
  
  describe('useConservationMain hook', () => {
  
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        ConservationContext.Provider,
        { value: mockContextValue },
        children
      );
  
    it('returns all items when searchText is empty', () => {
      const { result } = renderHook(() => useConservationMain(), { wrapper });
  
      expect(result.current.filteredData).toEqual(mockConservations);
    });
  
    it('filters items by search text (case-insensitive)', () => {
      const { result } = renderHook(() => useConservationMain(), { wrapper });
  
      act(() => {
        result.current.setSearchText('jam');
      });
  
      expect(result.current.filteredData).toEqual([mockConservations[0]]);
    });
  
    it('returns empty array if no match found', () => {
      const { result } = renderHook(() => useConservationMain(), { wrapper });
  
      act(() => {
        result.current.setSearchText('milk');
      });
  
      expect(result.current.filteredData).toEqual([]);
    });
  
    it('toggles isBigIcon state', () => {
      const { result } = renderHook(() => useConservationMain(), { wrapper });
  
      expect(result.current.isBigIcon).toBe(true);
  
      act(() => result.current.toggleIcon());
      expect(result.current.isBigIcon).toBe(false);
  
      act(() => result.current.toggleIcon());
      expect(result.current.isBigIcon).toBe(true);
    });
  
  });