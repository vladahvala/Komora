import { renderHook, act } from '@testing-library/react-hooks';
import { useOthersForm } from '../useOthersForm';
import { OthersContext } from '../../../context/OthersContext';
import React from 'react';

const addOtherMock = jest.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OthersContext.Provider
    value={{
      addOther: addOtherMock,
      others: [],
      loading: false,
      loadOthers: jest.fn(),
      updateImage: jest.fn(),
      deleteOther: jest.fn(),
      updateCount: jest.fn(),
      updateDate: jest.fn(),
      deleteHistory: jest.fn(),
    }}
  >
    {children}
  </OthersContext.Provider>
);

describe('useOthersForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds item correctly when form is valid', () => {
    const { result } = renderHook(() => useOthersForm(), { wrapper });

    act(() => {
      result.current.setName('Product A');
      result.current.setPacksCount('3');
    });
    
    act(() => {
      result.current.handleAddOther();
    });

    expect(addOtherMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Product A',
        count: 3,
      })
    );

    // перевірка структури об'єкта
    expect(addOtherMock.mock.calls[0][0]).toMatchObject({
      name: 'Product A',
      count: 3,
    });
  });

  it('shows modal when form is invalid (empty fields)', () => {
    const { result } = renderHook(() => useOthersForm(), { wrapper });

    act(() => {
      result.current.setName('');
      result.current.setPacksCount('');
      result.current.handleAddOther();
    });

    expect(result.current.modalVisible).toBe(true);
    expect(addOtherMock).not.toHaveBeenCalled();
  });

  it('shows modal when count is 0 or invalid', () => {
    const { result } = renderHook(() => useOthersForm(), { wrapper });

    act(() => {
      result.current.setName('Product A');
      result.current.setPacksCount('0');
      result.current.handleAddOther();
    });

    expect(result.current.modalVisible).toBe(true);
    expect(addOtherMock).not.toHaveBeenCalled();
  });
});