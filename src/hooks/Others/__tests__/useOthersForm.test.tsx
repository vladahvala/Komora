import { renderHook, act } from '@testing-library/react';
import { useOthersForm } from '../useOthersForm';
import { OthersContext } from '../../../context/OthersContext';
import React from 'react';

const addOtherMock = jest.fn();

const mockContextValue = {
  others: [],
  loading: false,
  loadOthers: jest.fn(),
  addOther: addOtherMock,
  updateImage: jest.fn(),
  deleteOther: jest.fn(),
  updateCount: jest.fn(),
  updateDate: jest.fn(),
  deleteHistory: jest.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(
    OthersContext.Provider,
    { value: mockContextValue },
    children
  );
};

describe('useOthersForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds item correctly when form is valid', () => {
    const { result } = renderHook(() => useOthersForm(), { wrapper });

    act(() => {
      result.current.setName('Product A');
      result.current.setPacksCount('3');
      result.current.handleAddOther();
    });

    expect(addOtherMock).toHaveBeenCalledTimes(1);
  });

  it('shows modal when form is invalid', () => {
    const { result } = renderHook(() => useOthersForm(), { wrapper });

    act(() => {
      result.current.setName('');
      result.current.setPacksCount('');
      result.current.handleAddOther();
    });

    expect(result.current.modalVisible).toBe(true);
    expect(addOtherMock).not.toHaveBeenCalled();
  });
});