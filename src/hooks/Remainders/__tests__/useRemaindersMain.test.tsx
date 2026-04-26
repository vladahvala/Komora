jest.mock('../../../services/notifications', () => ({
    configureNotifications: jest.fn(),
  }));
  
  import { renderHook, act } from '@testing-library/react-hooks';
  import React from 'react';
  import { useRemaindersMain } from '../useRemaindersMain';
  import { ConservationContext } from '../../../context/ConservationContext';
  
  const mockConservations = [
    {
      name: 'Apple',
      history: {
        2020: { period: 2 },
      },
    },
    {
        name: 'Banana',
        history: {
          2026: { period: 1 }, // expiration = 2027 → не expired
        },
    },
    {
      name: 'Apple Jam',
      history: {
        2021: { period: 1 },
      },
    },
  ] as any;
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConservationContext.Provider value={{ conservations: mockConservations } as any}>
      {children}
    </ConservationContext.Provider>
  );
  
  describe('useRemaindersMain', () => {
    it('returns only expired items initially', () => {
      const { result } = renderHook(() => useRemaindersMain(), { wrapper });
  
      expect(result.current.filteredData.length).toBe(2);
    });
  
    it('filters by search text', () => {
      const { result } = renderHook(() => useRemaindersMain(), { wrapper });
  
      act(() => {
        result.current.setSearchText('jam');
      });
  
      expect(result.current.filteredData.length).toBe(1);
      expect(result.current.filteredData[0].name).toBe('Apple Jam');
    });
  
    it('toggles icon state', () => {
      const { result } = renderHook(() => useRemaindersMain(), { wrapper });
  
      expect(result.current.isBigIcon).toBe(true);
  
      act(() => {
        result.current.toggleIcon();
      });
  
      expect(result.current.isBigIcon).toBe(false);
    });
  });